## Main tasks
1. Given a chunk(s) of text, generate a question and answer pair based on important concepts
	- **Approach**
   		 - Supervised learning might be a good method here, because "important" is a fuzzy word and it would make better sense to use lets say pdf textbooks and the end of the chapter questions and their answers as train, test, validate data
    	    - Use summarization techniques from nlp to filter down inputs https://www.machinelearningplus.com/nlp/text-summarization-approaches-nlp-example/
			- Given this approach, I think the bigger task would be to extract questions and answers from a textbook using NLP to generate our dataset. 
2. Generate similar, but not obvious false answers (or, would make it short answer and some how check validity to correct answer)
	- **Approach**
		- Again, data can be extracted from textbooks if they have multiple choice in the textbook questions and answers

## Model
### Transformers
The main model described is doing text transformations, going from the large text chunks to question and answer sentences. For this task, we can use transformer DNN model : https://lionbridge.ai/articles/what-are-transformer-models-in-machine-learning/

#### Limitations
-   Attention can only deal with fixed-length text strings. The text has to be split into a certain number of segments or chunks before being fed into the system as input
-   This chunking of text causes **context fragmentation**. For example, if a sentence is split from the middle, then a significant amount of context is lost. 

### Model Overview 
- Outline:
   - **Input:** chapter's worth of text
   - **Output:** List of question and answer pairs
- Potential options:
   - BERT seemed interesting as it has a semi-supervised approach and is very popular, plus made by google so has lots of empirical results 
   - Make a custom transformer model
   - Use OpenAI GPT-3 somehow

## Prerequisites
I have access to a fat GPU for training (Nvidia 3090 24 GB Graphics), so we should be good there.