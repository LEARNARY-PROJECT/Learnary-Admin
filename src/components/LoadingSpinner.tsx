import {
    Item,
    ItemContent,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
type SpinnerItemProps = {
    title: string;
    rightContent?:string;
    showSpinner?: true;
}
export function SpinnerLoading({
    title = "Đang xử lý",
    rightContent = "Đang xử lý, bạn đợi xíu nhé!",
}: SpinnerItemProps) {
    <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
        <Item variant="muted">
            <ItemMedia>
                <Spinner />
            </ItemMedia>
            <ItemContent>
                <ItemTitle className="line-clamp-1">{title}</ItemTitle>
            </ItemContent>
            <ItemContent className="flex-none justify-end">
                <span className="text-sm tabular-nums">{rightContent}</span>
            </ItemContent>
        </Item>
    </div>
}
