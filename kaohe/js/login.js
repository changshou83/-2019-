//密码框切换
var eye = document.querySelector("#eye");
var pwd = document.querySelector("#inputPassword");
var flag = 0;
pwdChange();
$(eye).on('click', pwdChange);

function pwdChange() {
    if (flag == 0) {
        pwd.type = 'password';
        eye.src = 'img/close.png';
        flag = 1;
    } else {
        pwd.type = 'text';
        eye.src = 'img/open.png';
        flag = 0;
    }
};
// 格式验证
var regqq = /^[1-9][0-9]{4,}$/g;
var regtel = /^[0-9]{11}$/g;
var regstudent_number = /^[0-9]{10}$/g;
var regpwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
$('#tel').on('blur', function() {
    var tel = $('#tel').val();
    if (!regtel.test(tel)) {
        console.log(!regtel.test(tel));
        $(".tel_no").css('display', 'block');
        flag[4] = false;
    } else {
        console.log(!regtel.test(tel));
        $(".tel_no").css('display', 'none');
        flag[4] = true;
    }
});
$('#student_number').on('blur', function() {
    var student_number = $('#student_number').val();
    if (!regstudent_number.test(student_number)) {
        console.log(!regstudent_number.test(student_number));
        $(".student_number_no").css('display', 'block');
        flag[5] = false;
    } else {
        console.log(!regstudent_number.test(student_number));
        $(".student_number_no").css('display', 'none');
        flag[5] = true;
    }
});
$('#qq').on('blur', function() {
    var qq = $('#qq').val();
    if (!regqq.test(qq)) {
        console.log(!regqq.test(qq));
        $(".qq_no").css('display', 'block');
        flag[6] = false;
    } else {
        console.log(!regqq.test(qq));
        $(".qq_no").css('display', 'none');
        flag[6] = true;
    }
});
$('#enroll-pwd').on('blur', function() {
    var enroll_pwd = $('#enroll-pwd').val();
    if (!regpwd.test(enroll_pwd)) {
        console.log(!regpwd.test(enroll_pwd));
        $(".enroll-pwd_no").css('display', 'block');
        flag[7] = false;
    } else {
        console.log(!regpwd.test(enroll_pwd));
        $(".enroll-pwd_no").css('display', 'none');
        flag[7] = true;
    }
});
//管理员登陆
$(".btn-default-admin-login").on("click", function() {
    var inputTel = $("#inputTel").val();
    var inputPassword = $("#inputPassword").val();

    //非空验证
    if (inputTel.length == 0) {
        alert("请输入手机号");
        return false;
    }
    if (inputPassword.length == 0) {
        alert("请输入密码");
        return false;
    }
    $.ajax({
        type: 'post',
        url: 'adminLoginServlet',
        data: {
            "tel": inputTel,
            "pwd": inputPassword
        },
        success: function(response) {
            if (response.OperationSuccess) {
                //登录成功跳到管理员界面
                location.href = 'admin-viewresume.html';
            } else alert('手机号或密码错误');
        },
        dataType: 'json'
    });
    //阻止表单的默认提交行为
    return false;
});


//用户登陆
$(".btn-default-user-login").on("click", function() {
    var inputTel = $("#user-tel").val();
    var userPassword = $("#userPassword").val();
    var chkCode = $("#chkCode").val();
    //非空验证
    if (inputTel.length == 0) {
        alert("请输入手机号");
        return false;
    }
    if (userPassword.length == 0) {
        alert("请输入密码");
        return false;
    }
    if (chkCode.length == 0) {
        alert("请输入验证码");
        return false;
    }
    $.ajax({
        type: 'post',
        url: 'LoginServlet',
        data: {
            "tel": inputTel,
            "pwd": userPassword,
            "checkcode": chkCode
        },
        success: function(response) {
            if (response.OperationSuccess) { //登录成功跳到个人界面
                location.href = 'person.html';
            } else {
                alert('手机号或密码或验证码错误');
            }
        },
        error: function() {
            alert('发生未知错误');
        },
        dataType: 'json'
    });
    //阻止表单的默认提交行为
    return false;
});

//切换验证码
$("#checkcode").on('click', function() {
    var dateTemp = +new Date();
    $(this).attr('src', "" + 'CheckCodeServlet?id=' + dateTemp + "");
});

//用户注册
$('.form-horizontal-enroll').on('submit', function() {
    var username = $('#username').val();
    var id = $('#student_number').val();
    var qq = $('#qq').val();
    var tel = $('#tel').val();
    var pwd = $('#enroll-pwd').val();
    var info = $('#enroll-info').val();
    //向服务器端发送添加用户的请求
    $.ajax({
        type: 'post',
        url: 'RegisterServlet',
        data: {
            "username": username,
            "id": id,
            "qq": qq,
            "tel": tel,
            "pwd": pwd,
            "info": info
        },
        success: function(response) {
            if (response.OperationSuccess) {
                //跳到个人界面
                location.href = "person.html";
            } else alert('注册失败');
        },
        error: function() {
            alert('发生未知错误');
        },
        dataType: 'json'
    });
    //阻止表单的默认提交行为
    return false;
});
//注册表单非空验证(封装函数不熟练，没成功)
var flag = [false, false, false, false, false, false, false, false];
$("#username").on("blur", function usernameBlankCheck() {
    var username = $("#username").val();
    if (username.length == 0) {
        $(".username_blank").css('display', 'block')
        flag[0] = false;
    } else {
        $(".username_blank").css("display", "none")
        flag[0] = true;
    }
    disableButton();
});
$("#student_number").on("blur", function studentBlankCheck() {
    var student_number = $("#student_number").val();
    if (student_number.length == 0) {
        $(".student_number_blank").css('display', 'block')
        flag[1] = false;
    } else {
        $(".student_number_blank").css("display", "none")
        flag[1] = true;
    }
    disableButton();
});
$("#tel").on("blur", function telBlankCheck() {
    var tel = $("#tel").val();
    if (tel.length == 0) {
        $(".tel_blank").css('display', 'block')
        flag[2] = false;
    } else {
        $(".tel_blank").css("display", "none")
        flag[2] = true;
    }
    disableButton();
});
$("#enroll-pwd").on("blur", function pwdBlankCheck() {
    var enroll_pwd = $("#enroll-pwd").val();
    if (enroll_pwd.length == 0) {
        $(".enroll-pwd_blank").css('display', 'block')
        flag[3] = false;
    } else {
        $(".enroll-pwd_blank").css("display", "none")
        flag[3] = true;
    }
    disableButton();
});

function disableButton() {
    var num = 0;
    flag.forEach(function(value) {
        if (value) {
            num++;
        }
        if (num == 8) {
            $(".btn-default").attr('disabled', false);
        } else {
            $(".btn-default").attr('disabled', true);
        }
    })
}
//检验手机号是否注册过
$('#tel').on('blur', function() {
    //非空验证
    if ($(this).length == 0) {
        alert("请输入手机号");
        return;
    };
    $.ajax({
        type: 'post',
        url: 'isExistUserServlet',
        data: {
            "tel": $('#tel').val()
        },
        success: function(response) {
            if (!response.isExistUser) {
                $(".tel_registered").css('display', 'none');
                $(".btn-default").attr('disabled', false);
            } else {
                $(".tel_registered").css('display', 'block');
                $(".btn-default").attr('disabled', true);
            }
        },
        error: function() {
            $(".tel_registered").css('display', 'block')
            $(".btn-default").attr('disabled', true);
        },
        //期望后端传递的数据为json格式
        dataType: 'json'
    })
});