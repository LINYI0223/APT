const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const resultContainer = document.getElementById('result-container');
const mbtiResult = document.getElementById('mbti-result');
const description = document.getElementById('description');

let currentQuestion = 0;
let answers = [];

const apiKey = 'sk-e47ff4f444f14aefb878db5f131447ce';
const apiUrl = 'https://api.deepseek.com/chat/completions';

const scenarios = [
    "你刚搬到一个新城市,周末到了,你会怎么安排这个周末呢?",
    "你的好朋友突然取消了你们长期计划的旅行,你会有什么反应?",
    "你在工作中遇到了一个棘手的问题,同事们意见不一,你会如何处理?",
    "你收到一份意外的礼物,但你不太喜欢,你会怎么做?",
    "你的朋友圈里有人发布了一条你不赞同的言论,你会采取什么行动?",
    "你被邀请参加一个重要的社交活动,但你其实更想待在家里,你会怎么做?",
    "你的团队正在讨论一个新项目的方案,你有不同的想法,你会如何表达?",
    "你发现自己的一个习惯可能影响到室友,但室友没有直接提出来,你会怎么处理?",
    "你在网上看到一个很吸引你的课程,但需要投入大量时间和精力,你会如何决定是否参加?",
    "你的朋友遇到了困难来向你倾诉,但你发现自己也有类似的烦恼,你会怎么应对这种情况?"
];

async function getNextQuestion() {
    if (currentQuestion < scenarios.length) {
        return scenarios[currentQuestion];
    } else {
        return "测试结束啦!让我们看看你的MBTI类型吧~";
    }
}

async function getAIResponse(userAnswer) {
    const messages = [
        {role: "system", content: "你是一个活泼友好的MBTI测试助手。请根据用户的回答给出简短的评价,并判断这个回答可能反映的MBTI特征。语气要轻松愉快,像朋友聊天一样。"},
        {role: "user", content: `用户的回答是: ${userAnswer}`}
    ];

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: messages,
                stream: false
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error);
        return "哎呀,好像出了点小问题呢。不过别担心,我们继续聊天吧!";
    }
}

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'ai-message');
    messageDiv.textContent = content;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function handleUserInput() {
    const userAnswer = userInput.value.trim();
    if (userAnswer === '') return;

    addMessage(userAnswer, true);
    userInput.value = '';

    answers.push(userAnswer);

    const aiResponse = await getAIResponse(userAnswer);
    addMessage(aiResponse);

    currentQuestion++;

    if (currentQuestion < 5) {  // 我们只问5个问题
        const nextQuestion = await getNextQuestion();
        addMessage(nextQuestion);
    } else {
        getFinalResult();
    }
}

async function getFinalResult() {
    const messages = [
        {role: "system", content: "你是一个活泼友好的MBTI专家,根据用户的所有回答给出最终的MBTI类型和简短描述。语气要轻松愉快,像朋友聊天一样。"},
        {role: "user", content: `根据以下回答判断MBTI类型并给出简短描述:\n${answers.join('\n')}`}
    ];

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: messages,
                stream: false
            })
        });

        const data = await response.json();
        const result = data.choices[0].message.content;
        
        addMessage("太棒啦!测试结束了!让我来看看你的MBTI类型是什么吧~");
        addMessage(result);

        document.getElementById('input-container').style.display = 'none';
    } catch (error) {
        console.error('Error:', error);
        addMessage('哎呀,获取结果时出了点小问题。不过别担心,你的回答都很精彩!');
    }
}

sendBtn.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// 开始测试
(async function startTest() {
    const firstQuestion = await getNextQuestion();
    addMessage("嗨!欢迎来参加我们的MBTI小测试!我们准备了一些有趣的场景,想听听你会怎么做。准备好了吗?来看看第一个问题吧!");
    addMessage(firstQuestion);
})();
