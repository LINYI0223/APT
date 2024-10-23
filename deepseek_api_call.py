from openai import OpenAI

def get_mbti_result(answers):
    client = OpenAI(api_key="sk-e47ff4f444f14aefb878db5f131447ce", base_url="https://api.deepseek.com")

    messages = [
        {"role": "system", "content": "你是一个MBTI专家,根据用户的所有回答给出最终的MBTI类型和简短描述。"},
        {"role": "user", "content": f"根据以下回答判断MBTI类型并给出简短描述:\n{answers}"}
    ]

    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=messages,
        stream=False
    )

    return response.choices[0].message.content

def get_next_question():
    client = OpenAI(api_key="sk-e47ff4f444f14aefb878db5f131447ce", base_url="https://api.deepseek.com")

    messages = [
        {"role": "system", "content": "你是一个MBTI测试专家。请提出一个生活场景的问题,用于判断用户的MBTI类型。问题应该开放式的,不是简单的是非题。"},
        {"role": "user", "content": "请给出下一个MBTI测试问题。"}
    ]

    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=messages,
        stream=False
    )

    return response.choices[0].message.content

def analyze_answer(answer):
    client = OpenAI(api_key="sk-e47ff4f444f14aefb878db5f131447ce", base_url="https://api.deepseek.com")

    messages = [
        {"role": "system", "content": "你是一个MBTI测试专家。请根据用户的回答给出简短的评价,并判断这个回答可能反映的MBTI特征。"},
        {"role": "user", "content": f"用户的回答是: {answer}"}
    ]

    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=messages,
        stream=False
    )

    return response.choices[0].message.content

# 示例使用
if __name__ == "__main__":
    print("这个文件现在主要用于后端API调用,不再包含示例使用。")
    print("请通过前端JavaScript代码来调用这些函数。")
