//Lógica de Factura
import Invoice from '../invoice/invoice.model.js'

//SaveFactura
export const invoiceSave = async(req, res) => {
    try {
        let data = req.body
        let invoice = new Invoice(data)
        await invoice.save()

        return res.send(
            {
                success: true,
                message: `The user's invoice was actually saved. ${invoice.user} `
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General Error saving invoice',
                err
            }
        )
    }
}

//GetAll
export const getAll = async(req, res) => {
    const { limit, skip} = req.query
    try {
        const invoices = await Invoice.find()
            .skip(skip)
            .limit(limit)
        if(invoices.length === 0){
            return res.send(
                {
                    success: false,
                    message: 'Invoice not found'
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'Invoice found',
                total: invoices.length,
                invoices
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}