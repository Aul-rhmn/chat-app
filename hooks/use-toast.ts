"use client"

// This is a simplified version of the use-toast hook
// In a real app, you would use the full shadcn/ui use-toast hook

import { useState, useCallback } from "react"

type ToastProps = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  onClose: () => void
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(({ title, description, variant = "default" }: Omit<ToastProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substring(2, 9)

    const newToast: ToastProps = {
      id,
      title,
      description,
      variant,
      onClose: () => {
        setToasts((toasts) => toasts.filter((t) => t.id !== id))
      },
    }

    setToasts((toasts) => [...toasts, newToast])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((toasts) => toasts.filter((t) => t.id !== id))
    }, 5000)

    return id
  }, [])

  return { toast, toasts }
}

