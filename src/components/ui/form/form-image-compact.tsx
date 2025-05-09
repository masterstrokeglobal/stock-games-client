import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useUploadImage } from "@/react-query/user-queries"
import { ImagePlus, X } from "lucide-react"
import React, { useCallback, useEffect, useState } from "react"
import { Control, FieldValues, Path, useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface FormImageProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>
    name: Path<TFieldValues>
    label?: string
    description?: string
    className?: string
    aspectRatio?: number ,
    aspectRatioDescription?: string
}

const FormImage = <TFieldValues extends FieldValues>({
    name,
    label,
    description,
    className,
    aspectRatio,
    aspectRatioDescription,
}: FormImageProps<TFieldValues>) => {
    const { setValue, getFieldState, getValues } = useFormContext()
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const uploadImageMutation = useUploadImage();

    const error = getFieldState(name).error?.message;
    const previewUrlValue = getValues(name);

    useEffect(() => {
        if (previewUrlValue) {
            setPreviewUrl(previewUrlValue);
        }
    }, [previewUrlValue]);

    const validateImageDimensions = (file: File): Promise<boolean> => {
        return new Promise((resolve) => {
            if (!aspectRatio) {
                resolve(true);
                return;
            }

            const img = new Image();
            img.onload = () => {
                const imageRatio = img.width / img.height;
                const isValidRatio = Math.abs(imageRatio - aspectRatio) < 0.4;
                resolve(isValidRatio);
            };
            img.src = URL.createObjectURL(file);
        });
    };

    const handleUpload = useCallback(async (file: File) => {
        if (aspectRatio) {
            const isValidDimensions = await validateImageDimensions(file);
            if (!isValidDimensions) {
                toast.error(`Image must have an aspect ratio of ${aspectRatioDescription}`);
                return;
            }
        }

        const formData = new FormData()
        formData.append('image', file)

        setIsUploading(true)
        uploadImageMutation.mutate(formData, {
            onSuccess: (response) => {
                const uploadedFileUrl = response.data.fileUrl;
                setValue(name as any, uploadedFileUrl);
                setPreviewUrl(uploadedFileUrl);
                setIsUploading(false)
                toast.success("Image uploaded successfully")
            },
            onError: () => {
                setPreviewUrl(null)
                setIsUploading(false)
                toast.error("Failed to upload image")
            }
        })
    }, [name, setValue, uploadImageMutation, aspectRatio, aspectRatioDescription])

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                handleUpload(file);
            } else {
                toast.error("Please upload a valid image file")
            }
        }
    }, [handleUpload])

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
        toast.info("Image removed")
    }, [name, setValue])

    return (
        <FormItem className={cn("space-y-2", className)}>
            {label && <FormLabel>{label}</FormLabel>}
          
            
            <FormControl>
                <div 
                    className={cn(
                        "relative w-full h-auto border border-dashed rounded-md flex items-center justify-center",
                        previewUrl 
                            ? "border-primary" 
                            : "border-input hover:border-primary"
                    )}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {previewUrl ? (
                        <div className="relative w-full h-full">
                            <img 
                                src={previewUrl} 
                                alt="Uploaded preview" 
                                className="w-48 h-auto object-cover rounded-md"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={handleRemove}
                                disabled={isUploading}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-2">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id={`file-upload-${name}`}
                            />
                            <label 
                                htmlFor={`file-upload-${name}`}
                                className="flex flex-col items-center cursor-pointer"
                            >
                                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Upload Image
                                </span>
                            </label>
                        </div>
                    )}
                </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}


            {isUploading && (
                <div className="text-sm text-muted-foreground text-center">
                    Uploading image...
                </div>
            )}

            <FormMessage>{error}</FormMessage>
        </FormItem>
    )
}

export default FormImage