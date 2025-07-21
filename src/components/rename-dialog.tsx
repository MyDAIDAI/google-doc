"use client";

import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogCancel, DialogAction } from "./ui/dialog";

interface RenameDialogProps {
  documentId: Id<"documents">;
  initialTitle: string;
  children: React.ReactNode;
}

export const RenameDialog = ({ documentId, children, initialTitle }: RenameDialogProps) => {
  const update = useMutation(api.documents.updateById);
  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  const onRename = async () => {
    setIsUpdating(true);
    await update({ id: documentId, title: title });
    setIsUpdating(false);
  }

  const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTitle(initialTitle);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent  onClick={(e) => e.stopPropagation()}>
          <form>
            <DialogHeader>
              <DialogTitle>Rename document?</DialogTitle>
              <DialogDescription>Enter a new name for your document.</DialogDescription>
            </DialogHeader>
            <div className="my-4">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <DialogFooter>
              <Button onClick={onCancel} disabled={isUpdating}>Cancel</Button>
              <Button onClick={onRename} disabled={isUpdating}>Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  )
}