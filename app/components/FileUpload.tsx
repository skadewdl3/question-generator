import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { cn } from '~/lib/utils'
const ACCEPTED_FILE_TYPES = ['application/pdf']
/*
  Schema for the form which validates the following
    1. Reject if files array is empty
    2. Reject if uploaded blob is not a file
    3. Reject if file is not an accepted file type
*/

const filesSchema = z
  .any()
  .refine((obj) => obj instanceof File)
  .refine((obj) => ACCEPTED_FILE_TYPES.includes(obj.type))
  .array()
  .nonempty()
type Props = {
  addFiles: (files: File[]) => void
  className?: string
}

export default function FileUpload({ addFiles, className = '' }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  return (
    <Card className={cn(className)}>
      <CardHeader className="text-2xl">
        <CardTitle>Upload PDFs</CardTitle>
        <CardDescription>
          Upload PDF files based on which PPT should be created.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          Upload files
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            let files = Array.from(e?.target?.files || [])
            if (filesSchema.parse(files)) addFiles(files)
          }}
          className="hidden"
          multiple
        />
      </CardContent>
    </Card>
  )
}
