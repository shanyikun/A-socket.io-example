$('#login').bind({
    'submit': function(event){
        var dataForm=$(this).serialize()
        $.ajax({
            url: '/login',
            type: 'post',
            dataType: 'json',
            data: dataForm,
            success: function(data){
                if(data.err_code===500){
                    $('#inform').text(data.message)
                }
                else if(data.err_code===1){
                    $('#inform').text(data.message)
                }
                else {
                    window.location.href='/chat'
                }
            }
        })
        event.preventDefault()
    }
})

$('input[name=name]').focus()