export async function getQuestion(history) {
    let GROQ_API_KEY="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"
    let res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                messages: history, 
                model: "llama-3.2-90b-vision-preview"
            })
        }
    )
    if(res.status != 200){
        throw [`status code: ${res.status}`, 
            res.statusText.length == 0 ? "something went wrong" : res.statusText
        ];
    }
    
    let data = await res.json();
    const message = data.choices[0].message
    // console.log("message returned", message);
    return message;
}