export interface IOrder {
    
    tourId: string | null,
    userId?: string | null,
    orderPerson?: IOrderPerson
    

}
export interface IOrderPerson {
    firstname:string,
    lastname:string,
    cardNumber:string,
    birthData:string;
    age:number
    citizenship:string;
}
export interface IOrderPerson {
    data: IOrder[],
    count:number
}