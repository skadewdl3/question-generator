import { json, type MetaFunction } from '@remix-run/node'
import { useMemo, useState } from 'react'
import prettyBytes from 'pretty-bytes'
import { useLoaderData } from '@remix-run/react'
import FileUpload from '~/components/FileUpload'
import { v4 as uuid } from 'uuid'
import { Badge } from '~/components/ui/badge'
import { IoCloseOutline as Close } from 'react-icons/io5'
import { CiText as Text } from 'react-icons/ci'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Separator } from '~/components/ui/separator'
import FilePreview from '~/components/FilePreview'
import QnaFormat from '~/components/QnaFormat'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export const loader = async () => {
  return json({ url: process.env.SERVER_URL })
}

enum FileUploadStatus {
  Uploaded,
  Uploading,
}

export type FileStatus = {
  name: string
  file: Promise<any> | string[][]
  size: number
  id: string
  status: FileUploadStatus
}

export default function Index() {
  // Get upload URL from the server
  const { url } = useLoaderData<typeof loader>()

  const [files, setFiles] = useState<FileStatus[]>([])
  const [viewFileId, setViewFileId] = useState<string | null>(null)
  const viewFile = useMemo(() => {
    return files.find((fileStatus) => fileStatus.id == viewFileId) || null
  }, [viewFileId])

  const uploadFile = async (file: File, id: string) => {
    let formData = new FormData()
    formData.append('file', file)
    try {
      let result = await fetch(`${url}/upload`, {
        method: 'POST',
        body: formData,
      })
      let data = await result.json()

      setFiles((files) =>
        files.map((fileStatus) => {
          if (fileStatus.id != id) return fileStatus
          else
            return {
              ...fileStatus,
              file: data.text,
              status: FileUploadStatus.Uploaded,
            }
        })
      )
      return data
    } catch (err) {
      return err
    }
  }

  // Create a function to handelr loading and error
  // states which makes the upload request
  const addFiles = (toUpload: File[]) => {
    let notUploaded = toUpload.map((file) => {
      let id = uuid()
      return {
        name: file.name,
        file: uploadFile(file, id),
        id,
        size: file.size,
        status: FileUploadStatus.Uploading,
      }
    })

    setFiles([...files, ...notUploaded])
  }

  return (
    <Dialog>
      {viewFile && <FilePreview file={viewFile} />}
      <div className="grid py-20 grid-cols-2 w-screen h-screen">
        <div className=" flex flex-col w-[400px] mx-auto self-start gap-2">
          <FileUpload addFiles={addFiles} />
          <QnaFormat />
        </div>
        <ul className="list-none px-8 w-full flex flex-col gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-2 border-input border-solid border-2 rounded-lg"
            >
              <span> {file.name} </span>
              <div className="flex items-center justify-end gap-2">
                {file.status == FileUploadStatus.Uploading && (
                  <Badge>Uploading</Badge>
                )}

                {file.status == FileUploadStatus.Uploaded && (
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setViewFileId(file.id)}
                      size="icon"
                      variant="outline"
                    >
                      <Text className="scale-125" />
                    </Button>
                  </DialogTrigger>
                )}
                <Button
                  onClick={() =>
                    setFiles(
                      files.filter((fileStatus) => file.id != fileStatus.id)
                    )
                  }
                  size="icon"
                  variant="outline"
                >
                  <Close className="scale-125" />
                </Button>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </Dialog>
  )
}
