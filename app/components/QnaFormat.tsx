import { useRef, useState } from 'react'
import { AutosizeTextarea } from './AutosizeTextarea'
import ComboBox from './ComboBox'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Textarea } from './ui/textarea'

const QUESTION_FORMATS = [
  {
    label: 'Assertion Reason',
    value: `Assertion (A): ...
Reasoning (R): ...
Answer: ...`,
  },
  {
    label: 'Short Answer',
    value: `Question: ...
Short Answer: ...`,
  },
  {
    label: 'Long Answer',
    value: `Question: ...
Long Answer: ...`,
  },
  {
    label: 'True or False',
    value: `Statement: ...
True/False Answer: ...`,
  },
  {
    label: 'Case Study Based',
    value:
      '[Add an extract from the data given to you and give questions and answer based on that.]',
  },
  {
    label: 'Image Based',
    value: `[Suggest an image to put here and give questions and answer based on that image]`,
  },
  {
    label: 'Fill in the Blanks',
    value: `... ______________ ...
a. ...
b. ...
c. ...
d. ...

Answer: ...`,
  },
  {
    label: 'Match the following',
    value: `Column A:
1) ...
2) ...
3) ...
4) ...

Column B:
a) ...
b) ...
c) ...
d) ...

Options:
a. ...
b. ...
c. ...
d. ...

Answer: ...`,
  },
  // Multiple correct MCQ, Match the following, Picture based questions, Lnog answer
  // true and false, case study (5 = 1 + 1 + 2)

  // Include blooosm taxonomy things
]

export default function QnaFormat() {
  const [questionFormat, setQuestionFormat] = useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Question Format</CardTitle>
        <CardDescription>
          Enter your own question format, or choose one from the below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ComboBox<string>
          items={QUESTION_FORMATS}
          triggerClassName="w-full"
          onChange={setQuestionFormat}
        />
        <AutosizeTextarea
          placeholder="Question Format"
          onChange={(e) => {
            setQuestionFormat(e.target.value)
          }}
          value={questionFormat || ''}
        />
      </CardContent>
    </Card>
  )
}
