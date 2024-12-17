const form = $('#callback-modal')
const button = form.find('button.accent-btn')
form.find('#callback-policy').on('change', (e) => {
    button.attr('disabled', !e.target.checked)
    // console.log($(this), e.target.checked)
})
form.find('p.text-error retry').on('click', ()=>{
    form.find('form').show(200)
    form.find('p.text-error').hide(200)  
})
form.on('submit', (e) => {
    e.preventDefault();
    if (form.find('input[type=tel]').attr('is_valid') === 'true') {
        $.post('https://pro-mesto.ru/send',
            {
                'is_robot':0,
                'callback-from-lot': window.location.href,
                'phone': form.find('input[type=tel]').val(),
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
            }).then((r) => {
                if (r.success == 1){
                    form.find('form').hide(200)
                    form.find('p.text-success').show(200)
                } else {
                    form.find('form').hide(200)
                    form.find('p.text-error').show(200)  
                }
            })
    } else {
        form.find('input[type=tel]').addClass('error')
        setTimeout(()=>{
            form.find('input[type=tel]').removeClass('error')
        }, 3000)
    }

})