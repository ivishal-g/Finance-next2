import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

type Option = {
  label: string
  value: string
}

type CustomSelectProps = {
  value?: string
  onChange?: (value: string) => void
  options: Option[]
  placeholder?: string
  disabled?: boolean
  onCreate?: (name: string) => void
}

export const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  onCreate,
}: CustomSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
        {onCreate && (
          <>
            <hr className="my-1 border-t" />
            <SelectItem
              value="__create__"
              onSelect={(e) => {
                e.preventDefault()
                const name = prompt("Enter new item")
                if (name) onCreate(name)
              }}
            >
              ➕ Create new
            </SelectItem>
          </>
        )}
      </SelectContent>
    </Select>
  )
}
