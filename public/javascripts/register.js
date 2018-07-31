$('#register').bind({
    'submit': function(event){
        var dataForm=$(this).serialize()
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/register',
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