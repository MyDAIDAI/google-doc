import { BsCloudCheck, BsCloudSlash } from 'react-icons/bs';
import { Id } from '../../../../convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import React, { useRef, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { useStatus } from '@liveblocks/react';
import { toast } from "sonner";
import { LoaderIcon } from 'lucide-react';

interface DocumentInputProps {
  title: string;
  id: Id<"documents">;
}

export const DocumentInput = ({ title, id }: DocumentInputProps) => {
  const status = useStatus();

  const [value, setValue] = useState(title);
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const mutate = useMutation(api.documents.updateById);

  const onBlur = () => {
    setIsEditing(false);
  }

  const debouncedUpdate = useDebounce((newValue: string) => {
    if(newValue === title) return;

    setIsPending(true);
    mutate({ id, title: value.trim() || "Untitled" }).then(() => {
      toast.success("Document renamed");
      console.log("Document renamed", toast);
    }).catch(() => {
      toast.error("Failed to rename document");
    }).finally(() => {
      setIsPending(false);
    });
  }, 500);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedUpdate(newValue);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(value === title) return;

    setIsPending(true);
    mutate({ id, title: value.trim() || "Untitled" }).then(() => {
      toast.success("Document renamed");
      setIsEditing(false);
    }).catch(() => {
      toast.error("Failed to rename document");
    }).finally(() => {
      setIsPending(false);
    });
  }

  const showLoader = isPending || status === "connecting" || status === "reconnecting";
  const showError = status === "disconnected";

  return (
    <div className="flex items-center gap-2">
      {
        isEditing ? (
          <form onSubmit={handleSubmit} className='relative w-fit max-w-[50ch]'>
            <span className='invisible whitespace-pre px-1.5 text-lg'>
              {value || " "}
            </span>
            <input
              ref={inputRef}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              className="absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate"
            />
          </form>
        ) : (
          <span 
            className="text-lg px-1.5 cursor-pointer truncate"
            onClick={() => {
              setIsEditing(true)
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
          >
            {title}
          </span>
        )
      }
      {!showError && !showLoader && <BsCloudCheck className='size-4' />}
      {showLoader && <LoaderIcon className='size-4 animate-spin text-muted-foreground'/>}
      {showError && <BsCloudSlash className='size-4'/>}
    </div>
  )
}