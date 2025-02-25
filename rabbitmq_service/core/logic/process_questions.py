
def process_questions(questions_list):
    processed_questions = []
    question_types = []
    answers_list = []
    hint_keywords=[]

    for question_dict in questions_list:
        for key, value in question_dict.items():
            
            if key.startswith('Q'):
                processed_questions.append(value)
            
            
            elif key == 'Type':
                question_types.append(value)
            
            
            elif key == 'Answer':
                answers_list.append(value)
            
            
            elif key=='hint_keywords':
                hint_keywords.append(value)
        
    return processed_questions, question_types, answers_list , hint_keywords