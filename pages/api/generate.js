import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
})

const openai = new OpenAIApi(configuration)
const basePromptPrefix = `
Create a detailed outline for a marketing blog post with the title below. Make sure to satisfy SEO requirements and ensure the blog post will rank highly in search engines.

Title: 
`
const generateAction = async (req, res) => {
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    temperature: 0.6,
    max_tokens: 250,
  })

  const tableOfContents = baseCompletion.data.choices.pop()

  const hookPrompt = `
  Take the table of contents and the title of the blog post below and generate an opening sentence with a strong hook for each section.

  Title: ${req.body.userInput}

  Table of Contents: ${tableOfContents.text}

  Blog Outline:
  `

  const hookPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${hookPrompt}`,
    temperature: 0.6,
    max_tokens: 1250,
  })

  const blogOutline = hookPromptCompletion.data.choices.pop()

  res.status(200).json({ output: blogOutline })
}

export default generateAction
