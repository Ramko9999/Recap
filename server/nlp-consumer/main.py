import pika
import os
from dotenv import load_dotenv
import json

if __name__ == "__main__":
    load_dotenv(".env")
    QUEUE_NAME = "document_jobs"

    json_decoder = json.decoder.JSONDecoder()

    amqp_uri = os.environ["AMQP_URI"]
    connection_params = pika.connection.URLParameters(amqp_uri)
    connection = pika.BlockingConnection(connection_params)

    channel = connection.channel()

    channel.queue_declare(QUEUE_NAME, durable=True)

    def on_message(ch, method, properties, body):
        def is_job_invalid(document_job):
            return document_job["documentId"] == "Invalid Document Id"

        document_job = json_decoder.decode(body.decode())
        if is_job_invalid(document_job):
            ch.basic_nack(delivery_tag=method.delivery_tag, multiple=False, requeue=False)
            return

        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(QUEUE_NAME, on_message_callback=on_message)
    channel.start_consuming()
