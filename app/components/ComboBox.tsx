import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { useEffect, useState } from 'react'

type ComboBoxItem<T> = {
  value: T
  label: string
}

type Props<T> = {
  items: ComboBoxItem<T>[]
  triggerClassName?: string
  onChange?: (value: T | null) => void
}

export default function ComboBox<T>({
  items,
  triggerClassName,
  onChange,
}: Props<T>) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<T | null>(null)

  useEffect(() => {
    onChange && onChange(value)
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('justify-between', triggerClassName)}
        >
          {value
            ? items.find((framework) => framework.value === value)?.label
            : 'Select item...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search item..." />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {items.map((item: ComboBoxItem<T>, index) => (
                <CommandItem
                  key={index}
                  value={String(item.value)}
                  // @ts-ignore
                  onSelect={(currentValue: T) => {
                    setValue(currentValue === value ? null : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
