        // Lấy tất cả các phần tử có lớp "formattedPrice"
        var priceElements = document.getElementsByClassName('formattedPrice');

        // Lặp qua từng phần tử để định dạng giá
        for (var i = 0; i < priceElements.length; i++) {
            var priceElement = priceElements[i];
            var price = parseFloat(priceElement.textContent);

            // Định dạng giá và gán lại vào phần tử HTML
            priceElement.textContent = formatPrice(price);
        }

        // Hàm định dạng giá
        function formatPrice(price) {
            // Sử dụng toLocaleString() để định dạng số
            return price.toLocaleString('en-US');
        }