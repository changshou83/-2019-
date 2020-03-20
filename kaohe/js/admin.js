var testCode;
//向后端请求数据(所有操作都在ajax的回调函数里，ajax的数据只能在ajax里用，传不出去)
$.ajax({
    type: 'post',
    url: 'adminResumeQueryServlet',
    dataType: 'json',
    success: function(response) {
        testCode = response.testCode;
        //渲染用户数据
        $('.heads').attr('src', testCode.userForm.heads);
        //制造简历
        var showResume = document.querySelector('.showResume');

        function createTable(data) {
            //根据后端传过来的简历份数动态制造test块
            for (let i = 0; i < data.userData.length; i++) {
                var user = document.createElement('form');
                user.method = 'post'
                user.className = 'test';
                showResume.appendChild(user);
                var table = document.createElement('table');
                user.appendChild(table);
                var tbody = document.createElement('tbody');
                table.appendChild(tbody);
                //抽取小框要显示的数据
                var showData = [];
                showData.push(data.userData[i].id);
                showData.push(data.userData[i].qq);
                showData.push(data.userData[i].photo);
                showData.push(data.userData[i].department);
                //制造行与列并填入数据
                for (let j = 0; j < 2; j++) {
                    var tr = document.createElement('tr');
                    tbody.appendChild(tr);
                    var td = document.createElement('td');
                    td.innerHTML = showData[j];
                    tr.appendChild(td);
                };
                //使其可以点开模态框
                $(user).attr("data-toggle", "modal");
                //给每份简历都加一个编号，便于操控(此序号用来标注是哪个test块打开了模态框，以便像模态框中渲染详细信息)
                $(user).attr('data-index', i);
                //用于删除功能
                user.className += '' + ' resume' + (i + 1) + '';
                //在第三个td中放入一个div，并将其bgImg换成用户数据(本来想制造三个行，然后将包含图片的行插入进去，没成功)
                var imgTr = document.createElement('tr');
                var imgTd = document.createElement('td');
                var id_photo = document.createElement('img');
                id_photo.src = showData[2];
                imgTr.appendChild(imgTd);
                imgTd.appendChild(id_photo);
                tbody.appendChild(imgTr);
                var tr = document.createElement('tr');
                var td = document.createElement('td');
                td.innerHTML = showData[3];
                tr.appendChild(td);
                tbody.appendChild(tr)
            }
        };
        createTable(testCode);
        //简历的总数
        var total = testCode.userData.length;
        //简历的总页数
        var pageNum = 0;
        //每页的简历数
        var limit = Math.floor(showResume.offsetWidth / 246) * 2;
        //获取所有简历元素
        var testList = document.querySelectorAll('.test');
        //分页
        function Pagination() {
            //计算页数
            if (total % limit == 0) pageNum = Math.floor(total / limit);
            else pageNum = Math.floor(total / limit) + 1;
            //只剩一个简历的时候不知道为什么会变为零，所以是零的话，就重新赋值为一
            if (pageNum == 0) pageNum = 1;
            //剩余简历数
            var surplus = total % limit;
            //页面应显示的简历数
            var showTests = 0;
            //为指定数量简历添加指定页数的标记
            for (let i = pageNum; i > 0; i--) {
                //如果他有pagei类名，就将之前的删除再赋值，如果没有就赋新的(思路:遍历test数组，比如条件是有page1这个名，先清掉)
                if ($(testList).each(function() { return $(this).hasClass('' + "page" + i + '') })) {
                    //去除之前的类名
                    $(testList).each(function() { $(this).removeClass('' + "page" + i + '') });
                    //如果最后一页少于八个的话，就让其添加指定数量的类名，避免报错找不到元素
                    if ($(testList[(i - 1) * limit]).data('index') == (pageNum - 1) * limit) showTests = surplus;
                    else showTests = limit;
                    if (showTests == 0) showTests = limit;
                    //添加新的page类名
                    for (let j = showTests; j > 0; j--) testList[(i - 1) * limit + j - 1].className += ' page' + i;
                } else {
                    if ($(testList[(i - 1) * limit]).data('index') == (pageNum - 1) * limit) showTests = surplus;
                    else showTests = limit;
                    if (showTests == 0) showTests = limit;
                    for (let j = showTests; j > 0; j--) testList[(i - 1) * limit + j - 1].className += ' page' + i;
                }
            }
        };
        Pagination();
        //页面初始化(显示第一页)
        showInit(1);
        //控制页面显示
        function showInit(i) {
            $(".test").css("display", 'none');
            $("" + '.page' + i + "").css("display", 'block');
        };
        //切换页面显示当前所处页面
        //当前页面
        var currentPage = document.querySelector('.currentPage');
        //首页
        var page1;
        //尾页
        var pageOver;
        //当前显示页面的序号
        var showingPageNum = 0;
        var showingPage;
        //控制按钮上下页禁止
        disabledButton();

        function disabledButton() {
            //获取第一页
            page1 = document.querySelector('.page1');
            //获取最后一页
            pageOver = document.querySelector('' + ".page" + pageNum + '');
            //判断是不是第一页或者最后一页，不是得话上下页都能点，否则的话根据情况禁用上下页按钮
            if (page1.style.display == 'block') {
                //如果只有一页就把两个按钮都禁用了
                if (pageNum == 1) {
                    $('.back').attr('disabled', true);
                    $('.forward').attr('disabled', true);
                } else {
                    $('.back').attr('disabled', true);
                    $('.forward').attr('disabled', false);
                }
            } else if (pageOver.style.display == 'block') {
                $('.forward').attr('disabled', true);
                $('.back').attr('disabled', false);
            } else {
                $('.back').attr('disabled', false);
                $('.forward').attr('disabled', false);
            };
        };

        //获取当前显示的页面
        function getShowing() {
            for (let i = pageNum; i > 0; i--) { if ($('' + ".page" + i + '').css('display') == 'block') showingPageNum = i; }
            showingPage = document.querySelectorAll('' + ".page" + showingPageNum + '');
            console.log(showingPageNum);
        };
        //下一页按钮
        $('.forward').on('click', function() {
            getShowing();
            //先将正在显示的页面消失掉，再使下一页出现并改变当前页面(就是右下角那个数字)
            $(showingPage).each(function() { $(this).css('display', 'none'); });
            var forwardPageNum = showingPageNum + 1;
            var forwardPage = document.querySelectorAll('' + ".page" + forwardPageNum + '');
            $(forwardPage).each(function() { $(this).css('display', 'block'); });
            currentPage.innerText = forwardPageNum;
            disabledButton();
        });
        //上一页按钮
        $('.back').on('click', function() {
            getShowing();
            //与下一页同理
            $(showingPage).each(function() { $(this).css('display', 'none'); });
            var backPageNum = showingPageNum - 1;
            var backPage = document.querySelectorAll('' + ".page" + backPageNum + '');
            $(backPage).each(function() { $(this).css('display', 'block'); });
            currentPage.innerText = backPageNum;
            disabledButton();
        });
        //显示总页面
        $(".totalPage").text(pageNum);
        //点击简历显示出具体信息
        $(".test").on("click", changeModalContent);
        //记录被点击的resume
        var clicked = 0;
        //改变简历信息模态框内容
        function changeModalContent() {
            //这是指明哪个resume块被点击
            var index = $(this).data('index');
            clicked = index;
            //循环对象将数据填入
            for (var k in testCode.userData[index]) {
                //将no排除，因为要显示的数据里并没有它，不排除掉会报错找不到
                if (k == 'no') continue;
                //图片特殊所以需要单独拿出来操作
                else if (k == 'photo') $('#modal-img').attr('src', '' + testCode.userData[index][k] + '');
                else document.getElementById("" + k + "").innerText = testCode.userData[index][k];
            };
            //检测类名决定改变红心与否
            var likePicture = document.querySelector('.like svg');
            if ($('' + '.resume' + (clicked + 1) + '').hasClass('collect')) likePicture.innerHTML = '<use xlink:href="#iconcol0"></use>';
            else likePicture.innerHTML = '<use xlink:href="#iconxinaixin"></use>';
            $("#myModal").modal('show');
        };
        //有意操作
        $(".like").on('click', function() {
            //赋予被点击的resume块collect的类名并改变图标
            var likePicture = document.querySelector('.like svg');
            if ($('' + '.resume' + (clicked + 1) + '').hasClass('collect')) {
                $.ajax({
                    type: 'post',
                    url: 'UncollectServlet',
                    data: {
                        'num': 1,
                        'no': testCode.userData[clicked].no
                    },
                    success: function(response) {
                        if (response.Uncollect) {
                            likePicture.innerHTML = '<use xlink:href="#iconxinaixin"></use>'; //空心
                            $('' + '.resume' + (clicked + 1) + '').removeClass('collect');
                        } else {
                            alert("啊，朋友，刚才睡着了，请重新操作一次");
                        }
                    },
                    dataType: 'json'
                })
            } else {
                $.ajax({
                    type: 'post',
                    url: 'CollectServlet',
                    data: {
                        'num': 1,
                        'no': testCode.userData[clicked].no
                    },
                    success: function(response) {
                        if (response.collected) {
                            likePicture.innerHTML = '<use xlink:href="#iconcol0"></use>'; //红心
                            $('' + '.resume' + (clicked + 1) + '').addClass('collect');
                        } else {
                            alert("啊，朋友，刚才睡着了，请重新操作一次");
                        }
                    },
                    dataType: 'json'
                })
            }

        });
        //删除功能
        function deleteTest() {
            //将目标删除
            $('' + ".resume" + (clicked + 1) + '').remove();
            //因为总数变了，所以需要重新获取test数组
            testList = document.querySelectorAll('.test');
            //resume总数减1
            total--;
            //重新分页
            Pagination();
            getShowing();
            //采用获取当前正在显示的页面的数的函数并将其传入页面初始化函数，每次删除后就使用一次显视初始化函数
            showInit(showingPageNum);
            disabledButton();
            //更新总页面
            $(".totalPage").text(pageNum);
        };
        //删除操作
        $(".delete").on('click', function() {
            $.ajax({
                type: 'post',
                url: 'DeleteServlet',
                data: {
                    'num': 1,
                    'no': testCode.userData[clicked].no
                },
                success: function(response) {
                    if (response.deleted) {
                        deleteTest();
                    } else {
                        alert("啊，朋友，刚才睡着了，请重新操作一次");
                    }
                },
                dataType: 'json'
            })
        });
        //导出操作
        $(".export").on('click', function() {});
        //退出登录
        $('#logout').on('click', function() {
            var isConfirm = confirm('您真的要退出吗?');
            if (isConfirm) {
                $.ajax({
                    type: 'post',
                    url: 'LogoutServlet',
                    success: function(response) {
                        //退出成功，返回登陆界面
                        location.href = 'login.html';
                    },
                    error: function() {
                        alert('退出失败');
                    }
                })
            }
        });
        //修改用户信息
        //点击编辑显示出用户信息
        $("#edit").on("click", function() {
            $("#userFormModal").modal('show');
        });
        //渲染信息进入用户信息模态框
        changeUserFormModalContent();

        function changeUserFormModalContent() {
            //循环对象将数据填入
            for (var k in testCode.userForm) {
                //将no排除，因为要显示的数据里并没有它，不排除掉会报错找不到
                if (k == 'no') continue;
                //图片特殊所以需要单独拿出来操作
                else if (k == 'photo') $('#userFormModal-img').attr('src', '' + testCode.userForm[k] + '');
                else document.getElementById("" + "user-" + k + "").innerText = testCode.userForm[k];
            };
        };
        //让用户可以修改个人信息
        var str;
        var originStr;
        $(".canChange").on("dblclick", function() {
            originStr = this.innerText;
            this.innerHTML = '<input type="text" class="user-input"/>';
            $('.user-input')[0].focus();
            $(".user-input").on('blur', function() {
                str = $(".user-input").val();
                if (str == '') this.parentNode.innerHTML = originStr;
                else this.parentNode.innerHTML = str;
            })
        });
        //将修改的信息传回后端
        $('.changeUserForm').on('click', function() {
            var username = $('#user-username').val();
            var id = $('#user-student_number').val();
            var qq = $('#user-qq').val();
            var tel = $('#user-tel').val();
            var pwd = $('#user-pwd').val();
            var info = $('#user-info').val();
            //向服务器端发送添加用户的请求
            $.ajax({
                type: 'post',
                url: 'UpdateUserInfoServlet',
                data: {
                    "username": username,
                    "id": id,
                    "qq": qq,
                    "tel": tel,
                    "pwd": pwd,
                    "info": info
                },
                success: function(response) {
                    if (response.ChangeSuccess) {
                        alert('修改成功');
                        //刷新页面
                        location = location;
                    } else alert('修改失败');
                },
                error: function() {
                    alert('发生未知错误');
                },
                dataType: 'json'
            });
            //阻止表单的默认提交行为
            return false;
        });
    }
});
/* 遇见的难题及解决方法(细节改动，思路不变)
问题1. 怎样让一个空的模态框(只是数据是空的，大框已经写好了)去显示我想要显示的那个简历的内容呢？此函数为changeModalContent
解决办法：
 1.首先给每一个class类名为test的div添加一个点击事件监听器(class类名为创建test块时添加进去的)，使其点击时将模态框显示出来。
 2.在显示出来的模态框内渲染进被点击的resume块所对应的数据，我设置了一个变量(clicked，此变量在渲染模态框里的数据时被赋值)用来记录被点击的块的索引数，根据此索引去数据中搜索对应数据，
 用循环对象的循环将内容渲染进去(因为是直接用的innerText，而不是添加，所以并不需要初始化)，。
问题2.怎样将制造好的resume块实现分页效果？(小提示:showResume这个大块使flex布局(可换行，内容靠左))此函数为Pagination
解决办法：
 1.我原先的想法就不说了，现在说完成的想法，通过循环给指定数量的resume块设置用于区分所属页数的类名pagei。
 2.说一下怎么赋类名的：
   1)首先根据拿到的数据的数量来确定一共要分多少页，是正好够分满每个页数还是多余出来不满一页的resume块多出来的要用变量surplus来记录。
   2)在判断每页要显示多少个resume块(有两个专门用来记录每页要显示多少的变量一个是limits(这个是铺满界面时的)，
   另一个是surplus(这个是没满的)，他们会根据条件来判断到底谁赋给showTests(这个是用来告诉循环要给多少个resume块赋类名))，
   然后利用两个循环(第一个循环用来循环页数，第二个用来循环每个resume块)来赋类名，这样每个页面的分类就做好了。
 3.首先显示page1(我专门写了一个函数showInit用来操作显示哪个界面，因为后面删除操作的时候，要重新显示界面)，
 然后如果要实现点击上一页或者下一页切换pagei的显示效果(这里写了一个currentPage用来做切换效果)，
 首先要获取当前正在显示的页面(这也有个函数getShowing，他将正在显示的界面的序号赋给了一个全局变量showingPageNum(好几个地方都用了它))，
 然后两个按钮的点击事件就会据此操作实现效果。
问题3.删除效果是怎么办到的？此函数为deleteTest
解决办法：
 1.首先将被点击的resume块移除，我需要知道怎样才能知道谁被点击了，这就要用到前面的clicked(问题一第二步)了，此变量里储存了被点击的resume块的索引，然后就好操作了。
 但是只是这样会出现一个问题:你删了以后每个resume块的page并不会变，所以就导致你把第一页删的就剩一个了，第二页的却没一个往上一页前推，我们要解决这个问题。
 2.既然他不会自己变，那我们就在每次删除操作之后重新进行分页操作，也就是说重新赋一边类名，在这之前我们要把之前的类名删掉，要不然这个块，会在两个页面同时存在(
 注:说明一下，我这个分页并不是把他分到两个div页面里(没转过弯来可能会认为他怎么会同时存在两个页面块里呢，所以要小心)，我觉得但看效果很容易这么想，所以其实可以这样想，有n个种类的resume块我让其中一种显示其他种类的resume隐藏以此达到效果)，
 所以我要改进分页函数，很简单，我们只要加一个判定条件:在他之前有没有pagei类名，如果有就去除掉再赋，没有的话就直接赋，不用担心我怎么知道谁是哪页的，只要判断他有没有pagei这个类名就行。
 因为循环会解决这个问题，循环会在在第n次循环删除第n页的pagei类名(这不会删除咱们新设的类名，
 举个例子:删除操作时第一次循环删除了有page1这个类名的resume块的page1类名(页面刚打开时赋的)，但是我们又同时给所有符合条件的resume块都赋了page1的类名(此时要删除的resume块已被删除，所以下一页的第一个resume块已经被分类到第一页里)，等到第二次循环时就会删除有page2的resume块的page2类名，以此类推)，
 然后将变量showingPageNum传给showInit函数，更新页面显示效果，这样就实现了删除效果。(注：此功能要ajax将删除的resume块的序号传给后端)
问题4.有意效果怎样做到？
解决办法：
 1.点击时切换svg图标，与此同时我们需要标记此简历已被有意，这里又用到了clicked这个变量，我们给这个被点击的resume块添加新的类名collect进行标注，并且我们要达到有意跟着resume块走的功能就需要改进渲染模态框内容的函数，
 2.改进函数：我们要进行判断他是否有collect这个类名，有的话就给他那个红心的svg图标，没有的话就给空心的。这样就达到效果。(注：此功能要ajax将有意的resume块的序号传给后端)
 */