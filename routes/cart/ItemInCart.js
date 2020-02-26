const express = require('express');
const router = express.Router();
const queries = require('../../queries');
const { queryAsync } = require('../../db');
const { cartAuth } = require('../../middleware/cart_auth');
const { tokenHandler } = require('../../middleware/token_handler');
const { sqlIdHandler } = require('../../middleware/sqlId_handler');
const ApiError = require('../../lib/apiError');

router.post('/:product_id', tokenHandler, sqlIdHandler, cartAuth, async (req, res, next) => {
    const { cartId, cartToken } = res.locals.cartInfo;
    const { productIdSQL, cartIdSQL } = res.locals.sqlInfo;
    const quantity = req.body.quantity || 1;

    try {
        const queryInfoAdd = queries.AddItemToCart(cartIdSQL, productIdSQL, quantity);
        const AddResult = await queryAsync(queryInfoAdd.text, queryInfoAdd.values);
        if (AddResult.rowCount < 1) {
            return next(new ApiError(500, 'fail to add item to cart'))
        }

        const queryInfoStatus = queries.UpdateCartStatus(cartIdSQL, 2);
        await queryAsync(queryInfoStatus.text, queryInfoStatus.values);

        const itemResult = await queryAsync(`select "item","total" from "itemView" where "itemId"=$1`, [AddResult.rows[0].pid])
        const data = itemResult.rows[0]

        res.send({
            cartId,
            cartToken,
            item: data.item,
            message: `${data.item.quantity} ${data.item.name} cupcakes added to cart`,
            total: data.total
        })
        return;

    } catch (err) {
        next(err);
    }
})

router.route('/:item_id')
    .all(
        tokenHandler,
        sqlIdHandler
        // GetCartIdByUser
    )
    .patch(UpdateItemQuantityInCart)
    .put(SetItemQuantityInCart)
    .delete(DeleteItemInCart);


async function UpdateItemQuantityInCart(req, res, next) {
    const quantity = req.body.quantity || 1;
    const { itemId, cartId } = res.locals;
    const { cartIdSQL } = res.locals.sqlInfo;

    try {
        const queryInfo = queries.UpdateItemInCart(quantity, itemId, cartIdSQL);
        const { rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
        if (rowCount < 1) {
            return next(new ApiError(500, 'item not in cart'));
        }

        const { item, total } = await GetItemDetail(itemId);
        if (item.quantity < 1) {
            await DeteleItem(itemId, cartIdSQL);
            res.send({
                cartId,
                message: `removed all ${item.name} from cart`
            })
            return;
        }

        if (quantity > 0) {
            res.send({
                cartId,
                item,
                message: `Added ${quantity} ${item.name} cupcakes to cart`,
                total
            })
            return;
        } else {
            res.send({
                cartId,
                item,
                message: `Removed ${quantity * -1} ${item.name} cupcakes from cart`,
                total
            })
            return;
        }




    } catch (err) {
        next(err);
    }
}

async function SetItemQuantityInCart(req, res, next) {
    const { cartIdSQL } = res.locals.sqlInfo;
    const { itemId, cartId } = res.locals;
    const quantity = req.body.quantity || 1;

    try {
        // if (!cartId) {
        //     return next(new ApiError(500, 'invalid auth'));
        // }
        const queryInfo = queries.SetItemQuantityInCart(quantity, itemId, cartIdSQL);
        const { rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
        if (rowCount < 1) {
            return next(new ApiError(500, 'item is not in cart'))
        }

        const { item, total } = await GetItemDetail(itemId);
        if (item.quantity < 1) {
            await DeteleItem(itemId, cartIdSQL);
            res.send({
                cartId,
                message: `removed all ${item.name} from cart`
            })
            return;
        }

        res.send({
            cartId,
            item,
            message: `Set ${item.name} cupcakes quantity to ${quantity}`,
            total
        })

    } catch (err) {
        next(err);
    }
}

async function DeleteItemInCart(req, res, next) {
    const { itemId, cartId } = res.locals;
    const { cartIdSQL } = res.locals.sqlInfo;

    try {
        const result = await GetItemDetail(itemId);
        if (!result) {
            return next(new ApiError(500, 'item not in cart'));
        }
        const { rowCount } = await DeteleItem(itemId, cartIdSQL);
        if (rowCount > 0) {
            res.send({
                cartId,
                message: `removed all ${result.item.name} from cart`,
            })
        }
        return next(new ApiError(500, 'fail to remove item from cart'));
    } catch (err) {
        next(err);
    }
}

async function GetItemDetail(itemId) {
    const { rows } = await queryAsync(`SELECT "item","total" from "itemView" where "itemId"=$1`, [itemId])
    return rows[0];
}

async function DeteleItem(itemId, cartIdSQL) {
    try {
        const queryInfo = queries.DeleteItemInCart(itemId, cartIdSQL);
        const result = await queryAsync(queryInfo.text, queryInfo.values);
        return result;
    } catch (err) {
        return err;
    }
}

// async function GetCartIdByUser(req, res, next) {
//     if (!res.locals.sqlInfo.cartIdSQL) {
//         const queryInfo = queries.GetCartIdByUser(res.locals.sqlInfo.uidSQL, 2);
//         const { rows, rowCount } = await queryAsync(queryInfo.text, queryInfo.values);
//         if (rowCount == 0) {
//             return next(new ApiError(500, 'invalid cart auth'))
//         }
//         res.locals.sqlInfo.cartIdSQL = rows[0].id;
//         res.locals.cartId = rows[0].cartId;
//     }
//     next()
// }

module.exports = router;