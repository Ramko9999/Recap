package services

import (
	"errors"
	"os"
	"time"
	"io"
	"log"
	"github.com/streadway/amqp"
)

type MQSession struct {
	Logger *log.Logger
	Connection *amqp.Connection
	Channel *amqp.Channel
	MessagePublishChan chan amqp.Confirmation
	MessageRetunChan chan amqp.Return
}

const (
	QUEUE_NAME = "document_jobs"
	MAX_PUSH_RETRIES = 3
	PUSH_RESEND_DELAY = time.Second * 2
)

var (
	errNotConnected = errors.New("not connected to RabbitMQ. Can't do this operation")
	errFailedToPush = errors.New("failed to send message to RabbitMQ, didn't recieve broker confirmation")
	errNack = errors.New("broker negatively acknowledged the message")
)

var MQ *MQSession

func (mq *MQSession) connect(mqUri string) error {
	if connection, err := amqp.Dial(mqUri); err != nil {
		return err
	} else {
		 mq.Connection = connection;
		 if err := mq.initChannel(); err != nil {
			 return err;
		 }
		 return nil
	}
}

func (mq *MQSession) initChannel() error {
	if mq.Connection == nil {
		return errNotConnected
	}

	channel, err := mq.Connection.Channel()
	if err != nil { return err }
	
	if _, err := channel.QueueDeclare(QUEUE_NAME, true, false, false, false, nil); err != nil {
		return err
	}

	if err := channel.Confirm(false); err != nil {
		return err;
	}

	mq.MessagePublishChan = channel.NotifyPublish(make(chan amqp.Confirmation))
	mq.MessageRetunChan = channel.NotifyReturn(make(chan amqp.Return))
	mq.Channel = channel

	go mq.handleReturns(mq.MessageRetunChan)
	return nil
}

func (mq *MQSession) handleReturns(rets chan amqp.Return) {
	for ret := range(rets) {
		mq.Logger.Fatalf("message %s returned. reason: %s", ret.Body, ret.ReplyText)
	}
}

func (mq *MQSession) Push(data []byte) error {
	message := amqp.Publishing{
		ContentType: "application/json",
		Timestamp: time.Now().UTC(),
		DeliveryMode: amqp.Persistent,
		Body: data,
	}

	for i := 0; i < MAX_PUSH_RETRIES; i++ {
		if err := mq.Channel.Publish("", QUEUE_NAME, true, false, message); err != nil {
			return err
		}
		
		select {
			case confirm := <-mq.MessagePublishChan:
				if confirm.Ack {
					mq.Logger.Printf("broker acknowledged message: %s\n", string(data))
					return nil 
				} else {
					mq.Logger.Printf("broker negatively acknowledged the message: %s\n", string(data))
					return errNack
				}
			case <- time.After(PUSH_RESEND_DELAY):
				mq.Logger.Printf("retrying %s for the %v time\n", string(data), i + 1)
		}
	}
	return errFailedToPush
}

func (mq *MQSession) Close(){
	close(mq.MessagePublishChan)
	close(mq.MessageRetunChan)
	if err := mq.Channel.Close(); err != nil{
		mq.Logger.Panicf("unable to close RabbitMQ channel: %s\n", err.Error())
	}
	if !mq.Connection.IsClosed() {
		if err := mq.Connection.Close(); err != nil {
			mq.Logger.Panicf("unable to close RabbitMQ connection: %s\n", err.Error())
		}
	}
}

func InitMessageQueue(writer io.Writer){
	logger := log.New(writer, "[AMQP] ", log.Ldate | log.Ltime | log.LUTC)
	MQ = &MQSession{
		Logger: logger,
	}
	if err := MQ.connect(os.Getenv("AMQP_URI")); err != nil {
		logger.Panicf("failed to connect to RabbitMQ: %s", err.Error())
	}
}


