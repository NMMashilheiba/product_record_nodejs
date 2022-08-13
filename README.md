
# product_record_nodejs

nodeJs api for storing product sells record to mongoDB

I have deployed this app on heroku so you can check it out here, https://sellsrecord.herokuapp.com/

# Routes:
## root 
'/'
## allProduct 
'/product/allproducts'
## top five products 
'/product/topproducts'
## today's revenue 
'/product/todaysrevenue'
## create record 
'/product/create/record'

example for create record:

{

  "name": "ProductName",
  
  "quantity": 2,
  
  "amount": 250,
  
  "dateTime": "2022-08-12"
  
}

