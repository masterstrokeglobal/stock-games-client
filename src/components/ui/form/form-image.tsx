import { Button } from "@/components/ui/button"
import { FormLabel } from "@/components/ui/form"
import { useUploadImage } from "@/react-query/user-queries"
import { ImagePlus, X } from "lucide-react"
import React, { useCallback, useEffect, useState } from "react"
import { Control, FieldValues, Path, useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { useTranslations } from 'next-intl'

interface FormImageProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>
    name: Path<TFieldValues>
    label?: string
    className?: string
}

const FormImage = <TFieldValues extends FieldValues>({
    name,
    label,
    className,
}: FormImageProps<TFieldValues>) => {
    const t = useTranslations('form-image')
    const { setValue, getFieldState, getValues } = useFormContext()
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    // Use the upload image mutation hook
    const uploadImageMutation = useUploadImage();

    const error = getFieldState(name).error?.message;
    const previewUrlValue = getValues(name);

    useEffect(() => {
        if (previewUrlValue) {
            setPreviewUrl(previewUrlValue);
        }
    }, [previewUrlValue]);

    const handleUpload = useCallback((file: File) => {
        const formData = new FormData()
        formData.append('image', file)

        setIsUploading(true)
        uploadImageMutation.mutate(formData, {
            onSuccess: (response) => {
                const uploadedFileUrl = response.data.fileUrl;
                setValue(name as any, uploadedFileUrl);
                setPreviewUrl(uploadedFileUrl);
                setIsUploading(false)
                toast.success(t('toast.upload-success'))
            },
            onError: () => {
                setPreviewUrl(null)
                setIsUploading(false)
                toast.error(t('toast.upload-error'))
            }
        })
    }, [name, setValue, uploadImageMutation, t])

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                handleUpload(file);
            } else {
                toast.error(t('toast.invalid-file'))
            }
        }
    }, [handleUpload, t])

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, [])

    const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
    }, [handleUpload])

    const handleRemove = useCallback(() => {
        setPreviewUrl(null)
        setValue(name as any, null)
        toast.info(t('toast.image-removed'))
    }, [name, setValue, t])

    return (
        <div className={`${className} space-y-2`}>
            {label && <FormLabel className="text-white">{label || t('default-label')}</FormLabel>}

            <div 
                className={`
                    relative border-2 border-dashed rounded-lg text-center 
                    transition-colors duration-300
                    ${previewUrl ? 'border-blue-400' : 'border-gray-300 hover:border-blue-500'}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {previewUrl ? (
                    <div className="relative aspect-square" >
                        <img 
                            src={previewUrl} 
                            alt={t('image.preview-alt')}
                            className="mx-auto h-full rounded-md object-cover"
                        />
                        <Button
                            variant="destructive"
                            onClick={handleRemove}
                            className="absolute top-0 right-0"
                            size="icon"
                            disabled={isUploading}
                        >
                            <X size={18} />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-2 aspect-square space-y-2">
                        <ImagePlus className="h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600">
                            {t('upload.click-to-upload')}
                        </p>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="sr-only"
                            id={`file-upload-${name}`}
                        />
                        <label 
                            htmlFor={`file-upload-${name}`}
                            className="cursor-pointer bg-blue-500 text-white text-sm mt-4 block px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            {t('upload.select-image')}
                        </label>
                    </div>
                )}
            </div>

            {isUploading && (
                <div className="text-sm text-muted-foreground text-center">
                    {t('status.uploading')}
                </div>
            )}

            {error && <span className="text-red-500 text-sm block">{error}</span>}
        </div>
    )
}

export default FormImage