import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info' | 'success';
    isLoading?: boolean;
}

export function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = 'danger',
    isLoading = false
}: ConfirmationDialogProps) {

    const getIcon = () => {
        switch (variant) {
            case 'danger': return <XCircle className="w-12 h-12 text-red-500" />;
            case 'warning': return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
            case 'success': return <CheckCircle2 className="w-12 h-12 text-green-500" />;
            default: return <Info className="w-12 h-12 text-blue-500" />;
        }
    };

    const getButtonClass = () => {
        switch (variant) {
            case 'danger': return "bg-red-600 hover:bg-red-700 text-white";
            case 'warning': return "bg-yellow-600 hover:bg-yellow-700 text-white";
            case 'success': return "bg-green-600 hover:bg-green-700 text-white";
            default: return "bg-blue-600 hover:bg-blue-700 text-white";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[400px] text-center p-8">
                <DialogHeader className="flex flex-col items-center gap-4">
                    <div className={cn(
                        "p-3 rounded-full mb-2",
                        variant === 'danger' && "bg-red-50",
                        variant === 'warning' && "bg-yellow-50",
                        variant === 'success' && "bg-green-50",
                        variant === 'info' && "bg-blue-50"
                    )}>
                        {getIcon()}
                    </div>
                    <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
                    <DialogDescription className="text-gray-500 text-base">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 sm:justify-center">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full sm:w-28 rounded-xl"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={cn("w-full sm:w-28 rounded-xl shadow-lg", getButtonClass())}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
