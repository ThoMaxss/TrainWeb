// Simple Toast Context for shadcn/ui usage
import { createContext, useContext, useCallback } from "react"

type ToastContextType = {
	show: (message: string) => void
}

const ToastContext = createContext<ToastContextType>({ show: () => {} })

export function useToast() {
	return useContext(ToastContext)
}

// You should wrap your app with <ToastProvider> and provide a real implementation for show().
// ToastProvider for shadcn/ui (Radix UI Toast)
import * as React from "react"
import { ToastProvider as RadixToastProvider, ToastViewport } from "@radix-ui/react-toast"

export function ToastProvider({ children }: { children: React.ReactNode }) {
	return (
		<RadixToastProvider swipeDirection="right">
			{children}
			<ToastViewport className="fixed bottom-4 right-4 z-50 outline-none" />
		</RadixToastProvider>
	)
}
