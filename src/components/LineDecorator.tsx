export default function LineDecorator() {
    const base: string = "absolute bg-white bg-opacity-30 portrait:bg-opacity-50"
        + " transition-[transform,top,right,bottom,left] duration-1000"
    return <div className={"w-full h-full absolute top-0 left-0 z-[3] pointer-events-none overflow-hidden"}>
        <div className={`${base} w-full h-px top-[9.5rem] portrait:top-[9.375rem] right-0`}></div>
        <div className={`${base} w-px h-full top-0 right-[14.75rem] portrait:right-[5.75rem]`}></div>
        <div className={`${base} w-full h-px bottom-[11.25rem] portrait:bottom-[12rem] ${base}`}></div>
    </div>
}
