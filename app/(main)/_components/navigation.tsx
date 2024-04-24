import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon, PlusIcon, Search, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./user-item";
import Item from "./item";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import DocumentList from "./document-list";
function Navigation() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const pathname = usePathname();
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const create = useMutation(api.documents.create);
  useEffect(() => {
    if(isMobile){
      collapse();
    }
    else{
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if(isMobile){
      collapse();
    }
  }, [pathname , isMobile]);
  function handleMouseDown(event: React.MouseEvent<HTMLDivElement , MouseEvent>){
      event.preventDefault();
      event.stopPropagation();

      isResizingRef.current = true;

      document.addEventListener("mousemove" , handleMousemove)
      document.addEventListener("mouseup" , handleMouseup)
  }

  function handleMousemove(event : MouseEvent){
        if(!isResizingRef.current) return;

        let newWidth = event.clientX;

        if(newWidth < 240) newWidth = 240
        if(newWidth > 480) newWidth = 480

        if(sidebarRef.current && navbarRef.current){

          sidebarRef.current.style.width = `${newWidth}px`
          navbarRef.current.style.setProperty ("left",`${newWidth}px`)
          navbarRef.current.style.setProperty ("width",`calc(100% - ${newWidth}px)`)

        }
  }

  function handleMouseup(){
      isResizingRef.current = false;
      document.removeEventListener("mousemove" , handleMousemove)
      document.removeEventListener("mouseup" , handleMouseup)

  }

  const resetWidth = () => {
    if(sidebarRef.current && navbarRef.current){
      setIsCollapsed(false);
      setIsResetting(true);
        sidebarRef.current.style.width = isMobile ? "100%" : "240px";
        navbarRef.current.style.setProperty("width" , isMobile ? "0" : "calc(100% - 240px)")
        navbarRef.current.style.setProperty("left" , isMobile ? "100%" : "240px")

        setTimeout(() => setIsResetting(false), 300)
    }
  }

  const collapse = () => {
    if(sidebarRef.current && navbarRef.current){
      setIsCollapsed(true);
      setIsResetting(true);
        sidebarRef.current.style.width = "  0px";
        navbarRef.current.style.setProperty("width" , "100%")
        navbarRef.current.style.setProperty("left" , "0")

        setTimeout(() => setIsResetting(false), 300)
    }
  }

  const handleCreate = () => {
    const promise = create({title : "Untitled"})
    toast.promise(promise , {
      "loading" : "Creating a new node..." ,
      "success" : "New note created!" , 
      "error" : 'Failed to create a new note.'
    })
  }
  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "flex w-60 group/sidebar h-full relative bg-secondary overflow-y-auto z-[99999] flex-col",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          role="button"
          onClick = {collapse}
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm  hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>

        <UserItem />
          <Item 
          onClick={() => {}}
          label = "Search"
          icon = {Search}
          isSearch
  
          />
          <Item 
          onClick={() => {}}
          label = "Settings"
          icon = {Settings}
          
  
          />
        <Item 
        onClick={handleCreate}
        label = "New page"
        icon = {PlusIcon}

        />
        <div>
          {
           <DocumentList />
          }
        </div>

        <div className="mt-4">
          <p>Documents</p>
        </div>

        <div
        onMouseDown={handleMouseDown}
        onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 
            transtion cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        <nav className="bg-transaparent px-3 py-2 w-full">
          {
            isCollapsed && <MenuIcon onClick = {resetWidth} role = "button" className = "h-6 w-6 text-muted-foreground"/>
          }
        </nav>
      </div>
    </>
  );
}

export default Navigation;
