"use client"

// This is a simplified version of the toaster component
// In a real app, you would use the full shadcn/ui toaster component

import { useToast } from "@/hooks/use-toast"
import { Toast, ToastClose, ToastDescription, ToastTitle } from "@/components/ui/toast"
import { useEffect, useState } from "react"

export function Toaster() {
  const { toasts } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed top-0 z-[100] flex flex-col gap-2 p-4 max-h-screen w-full sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col-reverse sm:max-w-[420px]">
      {toasts.map(({ id, title, description, variant, onClose }) => (
        <Toast key={id} variant={variant}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          <ToastClose onClick={onClose} />
        </Toast>
      ))}
    </div>
  )
}

