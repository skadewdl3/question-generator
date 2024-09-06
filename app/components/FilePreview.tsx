import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { ScrollArea } from './ui/scroll-area'
import prettyBytes from 'pretty-bytes'
import { Separator } from './ui/separator'
import type { FileStatus } from '~/routes/_index'

type Props = {
  file: FileStatus
}

export default function FilePreview({ file }: Props) {
  const renderTextWithLineBreaks = (text: string[][]) => {
    return text.map((page, index, arr) => {
      return (
        <div key={index}>
          {page.map((block, i) => (
            <div key={i}>
              <span>{block}</span>
              <br />
            </div>
          ))}
          {index != arr.length - 1 && (
            <Separator className="w-full h-0.5 my-2" />
          )}
        </div>
      )
    })
  }

  return (
    <DialogContent className="max-w-[800px] max-h-[600px]">
      <DialogHeader>
        <DialogTitle>{file?.name}</DialogTitle>
        <DialogDescription>
          Size: {prettyBytes(file?.size || 0)}
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="w-full h-[500px]">
        {file &&
          Array.isArray(file.file) &&
          renderTextWithLineBreaks(file.file)}
      </ScrollArea>
    </DialogContent>
  )
}
