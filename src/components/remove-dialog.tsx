"use client";

import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "./ui/alert-dialog";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

interface RemoveDialogProps {
  documentId: Id<"documents">;
  children: React.ReactNode;
}

export const RemoveDialog = ({ documentId, children }: RemoveDialogProps) => {
  const remove = useMutation(api.documents.removeById);
  const [isRemoving, setIsRemoving] = useState(false);

  const onRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsRemoving(true);
    remove({ id: documentId }).then(() => {
      toast.success("Document removed");
    }).catch(() => {
      toast.error("Failed to remove document");
    }).finally(() => {
      setIsRemoving(false);
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent  onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will delete the document permanently.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onRemove} disabled={isRemoving}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}