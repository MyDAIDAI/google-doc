"use client"
import Image from "next/image"
import Link from "next/link"
import { DocumentInput } from "./document-input"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar"
import { BoldIcon, FileIcon, FileJsonIcon, FilePenIcon, FilePlusIcon, FileTextIcon, GlobeIcon, ItalicIcon, PrinterIcon, Redo2Icon, RemoveFormattingIcon, StrikethroughIcon, TextIcon, TrashIcon, Underline, Undo2Icon } from "lucide-react"
import { BsFilePdf } from "react-icons/bs"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { Avatars } from "./avatars"
import { Inbox } from "./inbox"
import { Doc } from "../../../../convex/_generated/dataModel"
import { useEditorStore } from "@/store/use-editor-store"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


interface NavbarProps {
  data: Doc<"documents">;
}

export const Navbar = ({ data }: NavbarProps) => {
  const { editor } = useEditorStore();
  const mutation = useMutation(api.documents.create);
  const router = useRouter();

  const onDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  }

  const onSaveJSON = () => {
    if(!editor) return;
   
    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], { type: "application/json" });
    onDownload(blob, `${data.title}.json`);
  }

  const onSaveHTML = () => {
    if(!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], { type: "text/html" });
    onDownload(blob, `${data.title}.html`);
  }

  const onSavePDF = () => {
    if(!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], { type: "application/pdf" });
    onDownload(blob, `${data.title}.pdf`);
  }

  const onSaveText = () => {
    if(!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], { type: "text/plain" });
    onDownload(blob, `${data.title}.txt`);
  }

  const onNewDocument = () => {
    mutation({
      title: "Untitled document",
      initialContent: "",
    }).then((documentId) => {
      toast.success("New document created");
      router.push(`/documents/${documentId}`);
    }).catch(() => {
      toast.error("Failed to create document");
    });
  }

  return (
    <nav className="flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={32} height={32 }/>
        </Link>
        <div className="flex flex-col">
          <DocumentInput title={data.title} id={data._id} />
          <div className="flex">
            <Menubar className="border-none bg-transparent shadow-none h-auto p-0 cursor-pointer">
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">File</MenubarTrigger> 
                <MenubarContent className="print:hidden">
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <FileIcon className="size-4 mr-2"/>
                      Save
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={onSaveJSON}>
                        <FileJsonIcon className="size-4 mr-2"/>
                        JSON
                      </MenubarItem>
                      <MenubarItem onClick={onSaveHTML}>
                        <GlobeIcon className="size-4 mr-2"/>
                        HTML
                      </MenubarItem>
                      <MenubarItem onClick={onSavePDF}>
                        <BsFilePdf className="size-4 mr-2"/>
                        PDF
                      </MenubarItem>
                      <MenubarItem onClick={onSaveText}>
                        <FileTextIcon className="size-4 mr-2"/>
                        Text
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem onClick={onNewDocument}>
                    <FilePlusIcon className="size-4 mr-2"/>
                    New Document
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <FilePenIcon className="size-4 mr-2"/>
                    Rename
                  </MenubarItem>
                  <MenubarItem>
                    <TrashIcon className="size-4 mr-2"/>
                    Remove
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => window.print()}>
                    <PrinterIcon className="size-4 mr-2"/>
                    Print <MenubarShortcut>&#x2318;P</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Edit
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <Undo2Icon className="size-4 mr-2"/>
                    Undo <MenubarShortcut>&#x2318;Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    <Redo2Icon className="size-4 mr-2"/>
                    Redo <MenubarShortcut>&#x2318;Y</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">Insert</MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>Table</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>
                        1 x 1
                      </MenubarItem>
                      <MenubarItem>
                        2 x 2
                      </MenubarItem>
                      <MenubarItem>
                        3 x 3
                      </MenubarItem>
                      <MenubarItem>
                        4 x 4
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">Format</MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <TextIcon className="size-4 mr-2" />
                      Text
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>
                        <BoldIcon className="size-4 mr-2"/>
                        Bold
                        <MenubarShortcut>&#x2318;B</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem>
                        <ItalicIcon className="size-4 mr-2"/>
                        Italic
                        <MenubarShortcut>&#x2318;I</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem>
                        <Underline className="size-4 mr-2"/>
                        Underline
                        <MenubarShortcut>&#x2318;U</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem>
                        <StrikethroughIcon className="size-4 mr-2"/>
                        Strikethrough &nbsp;&nbsp;
                        <MenubarShortcut>&#x2318;S</MenubarShortcut>
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem>
                    <RemoveFormattingIcon className="size-4 mr-2"/>
                    Clear Formatting
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 pl-6">
        <Avatars />
        <Inbox />
        <OrganizationSwitcher 
          afterCreateOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          afterSelectPersonalUrl="/"
        />
        <UserButton />
      </div>
    </nav>
  )
}