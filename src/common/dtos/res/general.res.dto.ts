export default class GeneralResDto<I> {
    message: string;

    statusCode: number;

    data?: I;

    pageNumber?: number;
}
