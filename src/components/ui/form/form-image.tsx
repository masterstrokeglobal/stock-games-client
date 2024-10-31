import React, { useState, ChangeEvent, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useFormContext, Path, FieldValues, Control } from "react-hook-form"
import { FormLabel } from "@/components/ui/form"

interface FormImageProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>
    name: Path<TFieldValues>
    label?: string
    className?: string
}

const FormImage = <TFieldValues extends FieldValues>({
    name,
    label = "Upload Image",
    className,
    control,
}: FormImageProps<TFieldValues>) => {
    const { setValue, getFieldState ,getValues} = useFormContext()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const error = getFieldState(name).error?.message;

    const previewUrlValue = getValues(name)?.fileUrl;

    useEffect(() => {
        if (previewUrlValue) {
            setPreviewUrl(previewUrlValue);
        }
    }, [previewUrlValue]);
    
    // Set the preview URL when a new file is selected
    useEffect(() => {
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile)
            setPreviewUrl(objectUrl)
            return () => URL.revokeObjectURL(objectUrl) // Clean up URL when component unmounts
        }
    }, [selectedFile])

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        if (file) {
            setSelectedFile(file)
            setValue(name as any, { file, filename: file.name }) // Set both file binary and name in React Hook Form
        }
    }

    const handleRemove = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
        setValue(name as any, {}) // Reset the field value
    }

    return (
        <div className={className}>
            {label && <FormLabel htmlFor={name}>{label}</FormLabel>}

            {previewUrl && (
                <div className="relative mb-4">
                    <img src={previewUrl} alt="Image preview" className="w-28 h-28 rounded-sm" />
                    <Button variant="destructive" onClick={handleRemove} className="absolute top-1 right-1" size="icon">
                        <X size={18} />
                    </Button>
                </div>
            )}

            <Input type="file" accept="image/*" onChange={handleFileChange} />

            {error && <span className="text-red-500 mt-2 block">{error}</span>}
        </div>
    )
}

export default FormImage
