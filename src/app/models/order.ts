export interface IOrder {
    age: string | null,
    birthDay: string | null,
    cardNumber: string | null,
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