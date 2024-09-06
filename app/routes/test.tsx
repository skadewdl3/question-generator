import { ActionFunctionArgs } from '@remix-run/node'
import {
  json,
  useActionData,
  useFetcher,
  useLoaderData,
} from '@remix-run/react'
import { useEffect } from 'react'
import { Button } from '~/components/ui/button'

const EXAMPLE_PROMPT = {
  type: 'Assertion Reason',
  data: `Agriculture
Gurpreet, Madho and Tina were walking through the village where they saw a farmer tilling land. The farmer told them that he was growing wheat and had just added manure to the soil to make it more fertile. He told the children that the wheat would fetch a good price in the mandi from where it would be taken to factories to make bread and biscuits from flour.
This transformation from a plant to a finished product involves three types of economic activities. These are primary, secondary and tertiary activities.
Primary activities include all those connected with extraction and production of natural resources. Agriculture, fishing and gathering are good examples. Secondary activities are concerned with the processing of these resources. Manufacturing of steel, baking of bread and weaving of cloth are examples of this activity. Tertiary activities provide support to the primary and secondary sectors through services. Transport, trade, banking, insurance and advertising are examples of tertiary activities.
Agriculture is a primary activity. It includes growing crops, fruits, vegetables, flowers and rearing of livestock. In the world, 50 per cent of persons are engaged in agricultural activity. Two-thirds of India’s population is still dependent on agriculture.
Favourable topography of soil and climate are vital for agricultural activity. The land on which the crops are grown is known as arable land (Fig. 3.1). In the map you can see that agricultural activity is concentrated in those regions of the world where suitable factors for the growing of crops exist.
Word Origin
The word agriculture is derived from Latin words ager or agri meaning soil and culture meaning, cultivation.
`,

  format: `Asertion (A): ...,
Reasoning (R): ...

Options:
a) ...
b) ...
c) ...
d) ...

Answer: b) ...`,
}

const EXAMPLE_RESPONSE = {
  question: `Assertion (A): Agriculture provided a more stable and consistent method of obtaining food compared
to hunting and gathering.
Reasoning (R): Agriculture reduced the uncertainty associated with hunting and gathering by allowing
humans to cultivate and rely on crops for a consistent food supply.

Options:
a) A is true and R is true
b) A is false and R is true
c) A is true and R is the correct explanation of A
d) A is false and R is not the correct explanation of A
`,
  answer: `a) A is true and R is true`,
}

export const action = async ({ request }: ActionFunctionArgs) => {
  let body = await request.json()
  // return json({ body })
  let model = '@cf/meta/llama-3-8b-instruct'
  let input: any = {
    messages: [
      {
        role: 'system',
        content:
          'You are a friendly assistant that generates questions of the given type along with answers using the given data. You will receive input in json format, and will give output in json format as well.',
      },
      {
        role: 'user',
        content: JSON.stringify(EXAMPLE_PROMPT),
      },
      {
        role: 'assistant',
        content: JSON.stringify(EXAMPLE_RESPONSE),
      },
      {
        role: 'user',
        content: JSON.stringify(body),
      },
    ],
  }
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/fa9d3da9946a9965af134783d6fecae1/ai/run/${model}`,
    {
      headers: {
        Authorization: 'Bearer oVG_4xpRPquPOKyHwrEJKVUFAkE1a7gimVRc5iMA',
      },
      method: 'POST',
      body: JSON.stringify(input),
    }
  )
  const result = await response.json()
  return json({ result: result.result.response })
}

export default function Test() {
  const fetcher = useFetcher<typeof action>({ key: 'test' })

  const sendQuestion = () => {
    fetcher.submit(
      {
        type: 'Fill in the blanks',
        data: EXAMPLE_PROMPT.data,
        format: `... ______________ ...
a. ...
b. ...
c. ...
d. ...

Answer: ...`,
      },
      {
        method: 'POST',
        encType: 'application/json',
      }
    )
  }

  useEffect(() => {
    console.log(fetcher.data?.result)
  }, [fetcher.data])

  return <Button onClick={sendQuestion}>Send Question</Button>
}
