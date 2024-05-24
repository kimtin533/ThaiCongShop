//Lấy ra id của sản phẩm khi check
const checkedBuys = document.querySelectorAll('input.edit_cart.delete_product-in-cart');
checkedBuys.forEach((checkedBuy)=>{
    checkedBuy.addEventListener('change',()=>{
            updateCheckAllStatus();
    })
})

//Sự kiện nút thanh toán
const btn_Pay = document.querySelector('button.btn.btn-lg.btn-block');
btn_Pay.disabled=true;
btn_Pay.style.pointerEvents = 'none';

btn_Pay.addEventListener('click',()=>{
    let arr_id_product =[];
    checkedBuys.forEach((checkedBuy)=>{
        if(checkedBuy.checked){
            arr_id_product.push(checkedBuy.value);
            var xhr_pay = new XMLHttpRequest();
            xhr_pay.open('POST','/thanhtoan',true);
            xhr_pay.setRequestHeader('Content-Type','application/json');
            xhr_pay.onreadystatechange = function() {
                if (xhr_pay.readyState == 4 && xhr_pay.status == 200) { 
                    let message = JSON.parse(xhr_pay.responseText);
                    console.log(message);
                    if(message){
                        window.location.href= '/thanhtoan';
                    }
                }
            };

            xhr_pay.send(JSON.stringify({arr_id_product:arr_id_product}));
        }
    })
})

//Sự kiện cho checkAll
const checkedAll = document.getElementById('checkAll');
checkedAll.addEventListener('change',()=>{
    checkedBuys.forEach((checkedBuy) => {
        checkedBuy.checked = checkedAll.checked;
    });
    if(checkedAll.checked){
        btn_Pay.disabled = false;
        btn_Pay.style.pointerEvents = 'auto';
    }else{
        btn_Pay.disabled=true;
        btn_Pay.style.pointerEvents = 'none';
    }
})

//Hàm kiểm tra xem nếu tất cả các checkedBuy được checked thì checkAll sẽ checked
function updateCheckAllStatus() {
    const allChecked = Array.from(checkedBuys).every((checkedBuy) => checkedBuy.checked);
    const someChecked = Array.from(checkedBuys).some((checkedBuy)=>checkedBuy.checked);
    checkedAll.checked = allChecked;
    if(someChecked || allChecked){
        btn_Pay.disabled = !someChecked
        btn_Pay.style.pointerEvents = 'auto';
    }
    else{
        btn_Pay.disabled=true;
        btn_Pay.style.pointerEvents = 'none';
    }

}

var noCart = document.querySelector('span.header__cart-notice');
var number = document.querySelectorAll('span.edit_cart.number_product');
//Xóa sản phẩm
const delete_products = document.querySelectorAll('i.edit_cart.delete_product-in-cart');
// delete_products.forEach((delete_product)=>{
//     delete_product.addEventListener('click',()=>{
//         let delete_id = delete_product.dataset.value;
//         var trElement = delete_product.parentNode.parentNode;
//         console.log(delete_id); 
//         var xhr_delete = new XMLHttpRequest();
//         xhr_delete.open('POST','/cart',true);
//         xhr_delete.setRequestHeader('Content-Type', 'application/json'); 
//         xhr_delete.onreadystatechange = function() {
//             if (xhr_delete.readyState == 4 && xhr_delete.status == 200) {
//                 var massage = JSON.parse(xhr_delete.responseText);
//                 // if(massage){
//                 //     window.location.href = '/cart';
//                 //     console.log("Đã xóa "+delete_id+" ra khỏi CSDL");
//                 // }
//                 if(massage){
//                     trElement.style.display='none';
//                     noCart.textContent = parseInt(noCart.textContent) - parseInt(massage.number);
//                 }
//             }
//         }
//         xhr_delete.send(JSON.stringify({delete_id:delete_id}));
//     })
// })

let delete_id = null;
let delete_name = null;
let trElement ;
var delete_Modal = document.getElementById('delete_modal');
let name_product_need_dele = document.querySelector('div.modal-body');
delete_products.forEach((delete_product)=>{
    delete_product.addEventListener('click',()=>{
        delete_id = delete_product.dataset.value;
        delete_name = delete_product.dataset.name;
        trElement = delete_product.parentNode.parentNode;
        name_product_need_dele.innerHTML = "Bạn có thực sự muốn xóa " + delete_name;
    });
});

delete_Modal.addEventListener('click',()=>{
    var xhr_delete = new XMLHttpRequest();
    xhr_delete.open('POST','/cart',true);
    xhr_delete.setRequestHeader('Content-Type', 'application/json'); 
    xhr_delete.onreadystatechange = function() {
        if (xhr_delete.readyState == 4 && xhr_delete.status == 200) {
            var massage = JSON.parse(xhr_delete.responseText);
                        // if(massage){
                        //     window.location.href = '/cart';
                        //     console.log("Đã xóa "+delete_id+" ra khỏi CSDL");
                        // }
            if(massage){
                trElement.style.display='none';
                noCart.textContent = parseInt(noCart.textContent) - parseInt(massage.number);
                document.getElementById('close_modal').click();
            }
        }
    }
        xhr_delete.send(JSON.stringify({delete_id:delete_id}));
});



//Tăng số lượng sản phẩm trong giỏ hàng
var btns_Plus = document.querySelectorAll('i.fa-plus')
btns_Plus.forEach((btn_Plus)=>{
    btn_Plus.addEventListener('click',()=>{
        let plus_id = btn_Plus.dataset.value;
        console.log(plus_id);
        btns_Minus.forEach((btn_Plus)=>{
            let minus_id = btn_Plus.dataset.value;
            if(minus_id === plus_id){
                btn_Plus.style.cursor='pointer';
            }
        })
        let number_productElement = btn_Plus.previousElementSibling;
        var xhr_plus = new XMLHttpRequest();
        xhr_plus.open('POST','/cart',true);
        xhr_plus.setRequestHeader('Content-Type', 'application/json'); 
        xhr_plus.onreadystatechange = function() {
            if (xhr_plus.readyState == 4 && xhr_plus.status == 200) {
                var massage = JSON.parse(xhr_plus.responseText);
                // if(massage){
                //     window.location.href = '/cart';
                //     console.log("Đã xóa "+delete_id+" ra khỏi CSDL");
                // }
                if(massage){
                    btn_Plus.previousElementSibling.textContent= parseInt(number_productElement.textContent) +1;
                    noCart.textContent = parseInt(noCart.textContent) +1;
                }
            }
        }
        xhr_plus.send(JSON.stringify({plus_id:plus_id}));
    })
})

// Định nghĩa hàm xử lý sự kiện
function clickMinus(event) {
    let minus_id = event.target.dataset.value;
    let number_productElement = event.target.nextElementSibling;
    console.log(number_productElement.textContent);
    if(parseInt(number_productElement.textContent) <= 1){
        event.target.removeEventListener('click', clickMinus);
        event.target.style.cursor= 'not-allowed';
    } else{
        var xhr_minus = new XMLHttpRequest();
        xhr_minus.open('POST','/cart',true);
        xhr_minus.setRequestHeader('Content-Type', 'application/json'); 
        xhr_minus.onreadystatechange = function() {
            if (xhr_minus.readyState == 4 && xhr_minus.status == 200) {
                var massage = JSON.parse(xhr_minus.responseText);
                if(massage){
                    event.target.nextElementSibling.textContent= parseInt(number_productElement.textContent) - 1;
                    noCart.textContent = parseInt(noCart.textContent)-1;
                }
            }
        }
        xhr_minus.send(JSON.stringify({minus_id:minus_id}));
    }
}

// Gắn kết sự kiện 'click' với mỗi phần tử 'i.fa-minus'
var btns_Minus = document.querySelectorAll('i.fa-minus');
btns_Minus.forEach((btn_Minus)=>{
    let number_productElement = parseInt(btn_Minus.nextElementSibling.textContent);
    if(number_productElement === 1){
        btn_Minus.style.cursor= 'not-allowed';
    }
    btn_Minus.addEventListener('click', clickMinus);
});


