import { QueryResult } from "pg";
import { pool } from "../dbConnect/db";
import { ItemCart, Order, OrderInfo } from "../model/Order";
const { v4: uuid } = require("uuid");

class OrderService {
  // update = async (id_user:string,id_order:string) => {
  //     await pool.query(`update "order" set is_temporary=false,time_order=NOW()::timestamp where id_user=$1 and id_order=$2`,[id_user,id_order])
  // }

  get = async (idUser: string, page: number, perPage: number) => {
    const data: QueryResult = await pool.query(
      `select o.id_order,o.id_user,o.total,o.is_temporary,o.status,o."closeAt",o.email ,o.full_name,
        o.phone_number ,o.address,o.payment,op.id_product ,op.quantity ,to_char(op.price, '99.99') price ,w.weight ,pl.name_product ,pp.id_picture ,pp.image 
        from "order" o join order_product op on o.id_order =op.id_order
        join product p on p.id_product=op.id_product
        join weight w on w.id_weight =p.id_weight
        join product_line pl on pl.id_product_line =p.id_product_line
        join (select distinct on(id_product_line) id_product_line, id_picture,image from product_picture) pp on pp.id_product_line =pl.id_product_line
        where o.id_order in (select id_order from "order" where id_user=$1 
        and is_temporary=false order by "closeAt" desc limit $2 offset ($3-1)*$2 )`,
      [idUser, perPage, page]
    );

    const total: QueryResult = await pool.query(
      `select count(*) from "order" where id_user=$1 and is_temporary=false`,
      [idUser]
    );

    const totalOrder = total.rows[0].count;

    let orderList: OrderInfo[] = [];

    const listFull = data.rows;
    let listIdOrder: string[] = [];

    listFull.map((item) => listIdOrder.push(item.id_order));
    listIdOrder = Array.from(new Set(listIdOrder));

    listIdOrder.map((idOrder) => {
      const orderInfo: OrderInfo = {
        idOrder: "",
        idUser: "",
        total: 0,
        isTemporary: false,
        status: "",
        createAt: "",
        closeAt: "",
        email: "",
        name: "",
        phone: "",
        address: "",
        payment: "",
        itemCarts: [],
      };

      listFull.map((item) => {
        (orderInfo.idOrder = item.id_order),
          (orderInfo.idUser = item.id_user),
          (orderInfo.total = item.total),
          (orderInfo.isTemporary = item.is_temporary),
          (orderInfo.status = item.status),
          (orderInfo.createAt = item.createAt),
          (orderInfo.closeAt = item.closeAt),
          (orderInfo.email = item.email),
          (orderInfo.name = item.full_name),
          (orderInfo.phone = item.phone_number),
          (orderInfo.payment = item.payment);
        orderInfo.address = item.address;

        if (item.id_order === idOrder) {
          const itemCart: ItemCart = {
            idOrder: "",
            idProduct: "",
            quantity: 0,
            price: 0,
            nameProductLine: "",
            idProductLine: "",
            weight: "",
            images: [],
          };

          (itemCart.idOrder = item.id_order),
            (itemCart.idProduct = item.id_product),
            (itemCart.quantity = item.quantity),
            (itemCart.price = item.price),
            (itemCart.nameProductLine = item.name_product),
            (itemCart.idProductLine = item.id_product_line),
            (itemCart.weight = item.weight);

          let indexImage = itemCart.images.findIndex(
            (x) => x.idPicture === item.id_picture
          );

          if (indexImage === -1) {
            itemCart.images.push({
              idPicture: item.id_picture,
              idProductLine: item.id_product_line,
              image: item.image,
            });
          }
          orderInfo.itemCarts.push(itemCart);
        }
      });
      orderList.push(orderInfo);
    });
    return { orderList, totalOrder };
  };
}

export const orderService = new OrderService();
