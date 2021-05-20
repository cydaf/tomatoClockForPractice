# BACKEND

## Getting Started

This project uses the following tools. Go check them out if you don't have them locally installed.

- [docker](https://www.docker.com/)
- [node 14.15.X](https://nodejs.org/en/)

Build the project.

1. git clone https://github.com/cydaf/tomatoClockForPractice.git
2. cd tomatoClockForPractice/server
3. npm install
4. docker-compose up -d
5. npm run start

## API Spec
[document](https://hackmd.io/vMKpHbg2TQOqUy2zRgtTcA?view)

### Overview

Header
- Accept: application/json
- Content-Type: application/json

API 簡介

- POST `/api/auth/register` 註冊
- GET `/api/auth/verify` 驗證
- POST `/api/auth/signin` 登入
- POST `/api/auth/forgetpassword` 忘記密碼
- GET `/api/auth/resendemail` 重寄驗證信
- GET `/api/user` 使用者資料
- GET `/api/tasks` 取得全部待辦事項
- POST `/api/tasks` 新增待辦事項
- PATCH `/api/tasks/:id` 修改指定待辦事項資料
- DELETE `/api/tasks/:id` 刪除待辦事項
- GET `/api/reports` 取得專注度報表


### Register POST `/api/auth/register`
Request Parameter
```jsx
{
    // required parameters
    name: "string",
    email: "string",
    password: "number"
}
```
Response success (email未註冊過)
```jsx
{
    status: 200,
    data:{
        message: "please verify email",
        verified: false
    }
}
```

Response failure (password 格式不符合 or email 已經被使用)

1. 密碼格式不符合
```jsx
{
    status: 401,
    errors: {
        email: "",
        password: "密碼需包含英文大小寫和數字，長度超過8位數"
    }
}
```
2. email 已經存在
```jsx
{
    status: 401,
    errors: {
        email: "email has been used",
        password: ""
    }
}
```
3. 需填入 email 
```jsx
{
    status: 401,
    errors: {
        email: "email is required",
        password: ""
    }
}
```
4. email 格式錯誤
```jsx
{
    status: 401,
    errors: {
        email: "email format is invalid",
        password: ""
    }
}
```
### Verify GET `/api/auth/verify`
Request Parameter
```jsx
{
    // required parameters
    id: 
    verifiedCode: 
}
```


Response success (email 已驗證)
```jsx
{
    status: 200,
    message: "signup success"
}
```

Response failure (email 失敗)
```jsx
{
    status: 401,
    message: "link incorrect"
}
```

### Signin POST `/api/auth/signin`
Request Parameter
```jsx
{
    // required parameters
    email: "string",
    password: "string"
}
```


Response success
```jsx
{
    status: 200,
    data: {
        token:.....,
    }
}
```

Response failure (2 種情境：email 不存在 or password 錯誤 )
```jsx
{
    status: 401,
    errors: {
        email: "email doesn't exist",
        password: ""
    }
}
```

```jsx
{
    status: 401,
    errors: {
        email: "",
        password: "password incorrect"
    }
}

```

### 寄送重設密碼信件 POST `/api/auth/send_forgetPassword_email`

Request Parameter
```jsx
{
    // required parameters
    email: "string"
}
```

Response success
```jsx
{
    status: 200,
    data: {
        result: "ok"
    }
}
```

=> 寄信給 email，帶上
localhost:3000/resetPasswordByToken?id={userId}&toke={token}

=> 進入前端 => 呈現表單輸入新密碼
=> 送出會打 POST `/api/auth/forgetpassword`



### forgetPassword POST `/api/auth/forgetpassword`
Request Parameter
```jsx
{
    // required parameters
    userId: "string", // userId
    password: "string"
    verifyToken: "....."
}
```


Response success
```jsx
{
    status: 200,
    data: {
        token:.....,
    }
}
```

Response failure
```jsx
{
    status: 401,
    errors: {
        email: "email doesn't exist",
        password: ""
    }
}
```
Response failure
```jsx
{
    status: 401,
    errors: {
        email: "",
        password: "密碼需包含英文大小寫和數字，長度超過8位數"
    }
}
```
### resendemail GET `/api/auth/resend_verify_email`
Request Parameter
```jsx
{
    // required parameters
    email: "string"
}
```


Response success
```jsx
{
    status: 200,
    message: "verification resent"
}
```

Response failure
```jsx
{
    status: 401,
    errors: {
        email: "email doesn't exist",
        password: ""
    }
}
```

### user GET `/api/user`
Request Header
```jsx
{
    // required parameters
    token: "string"
}
```
Response success
```jsx
{
    status: 200,
    data: {
        email:....,
        name:.....
    }
}
```
Response failure
```jsx
{
    status: 401,
    message: "token incorrect"
}
```
Response failure（token 過期、沒給 token）
```jsx
{
    status: 401,
    message: "please login"
}
```
### 取得全部待辦事項 GET `/api/tasks` 
Request Header
```jsx
{
    // required parameters
    token: "string"
}
```
Request Parameter (Params)
```jsx
{
    // optional parameter
    // oneOf ("", completed","uncompleted")
    // default ""
    filterType: "string"
}
```


Response

```jsx
{
    status: 200,
    data: {
        tasks: [
            {
                id: 1,
                content: "通識課作業",
                completed: false,
                completedAt: null,
                createdAt: "2021-02-11T09:03:00.910Z",
                updatedAt: "2021-02-11T09:03:00.910Z",
            },
            {
                id: 2,
                content: "選課",
                completed: false,
                completedAt: null,
                createdAt: "2021-02-11T09:03:00.910Z",
                updatedAt: "2021-02-11T09:03:00.910Z",
            },
            // ...
        ]
    }
}
```
Response failure（token 過期、沒給 token）
```jsx
{
    status: 401,
    message: "please login"
}
```

Testing curl
```jsx
curl -H "Accept: application/json" -H "Content-Type: application/json" -X GET https://yourapiserver/api/tasks
```

### 新增待辦事項 POST `/api/tasks` 
Request Header
```jsx
{
    // required parameters
    token: "string"
}
```
Request Parameter (Body)
```jsx
{
    // required ""
    content: "string"
}
```



Response Success

```jsx
{
    status: 201,
    data: {
        {
            id: 3,
            content: "買晚餐",
            completed: false,
            completedAt: null,
            createdAt: "2021-02-11T09:03:00.910Z",
            updatedAt: "2021-02-11T09:03:00.910Z",
        }
    }
}
```

Response Failure


```jsx
{
    status: 400,
    message: "'content' is required parameter."
}
```
Response failure（token 過期、沒給 token）
```jsx
{
    status: 401,
    message: "please login"
}
```

Testing Curl

```jsx
curl -X POST -H "Content-Type: application/json" -d '{"content" : "必修課作業" }' "http://www.example.com/api/tasks"
```


### 修改指定待辦事項資料 Patch `/api/tasks/:id` 

Request Header
```jsx
{
    token: "string"
}
```

Request Parameter (Body)
```jsx
{
    // optional parameter
    "content": string,
    // optional parameter
    "completed": bool
}
```

Response Success

```jsx
{
    status: 200,
    data: {
        {
            id: 3,
            content: "買晚餐",
            completed: true,
            completedAt: "2021-02-12T09:03:00.910Z",
            createdAt: "2021-02-11T09:03:00.910Z",
            updatedAt: "2021-02-12T09:03:00.910Z",
        }
    }
}
```
Response failure（token 過期、沒給 token）
```jsx
{
    status: 401,
    message: "please login"
}
```

Testing Curl

```jsx
curl -X PATCH -H "Content-Type: application/json" -d '{"content" : "必修課作業" }' "http://www.example.com/api/tasks/4"
```

```jsx
curl -X PATCH -H "Content-Type: application/json" -d '{"completed" : "true" }' "http://www.example.com/api/tasks/1"
```

### 刪除待辦事項 DELETE `/api/tasks/:id` 

Request Header
```jsx
{
    token: "string"
}
```

Response Success

```jsx
{
    status: 200,
    data: {}
}
```
Response failure（token 過期、沒給 token）
```jsx
{
    status: 401,
    message: "please login"
}
```

Testing Curl

```jsx
curl -X DELETE "https://yourapiserver/api/tasks/1"
```

### 取得專注度報表 GET `/api/reports`

Request Header
```jsx
{
    // required parameters
    token: "string"
}
```

Response Success

```jsx
{
    status: 200,
    data: {
        todayReport: {
            createdTotal: 3,
            completedTotal: 1
        },
        weeklyReport: {
            createdTotal: 15,
            completedTotal: 10
        },
        dailyReport: [
            {date: "7/06", createdTotal: 3, completedTotal:1},
            {date: "7/07", createdTotal: 4, completedTotal:4},
            {date: "7/08", createdTotal: 5, completedTotal:3},
            {date: "7/09", createdTotal: 0, completedTotal:0},
            {date: "7/10", createdTotal: 3, completedTotal:2},
            {date: "7/11", createdTotal: 0, completedTotal:0},
            {date: "7/12", createdTotal: 0, completedTotal:0}
        ]
    }
}
```
Response failure（token 過期、沒給 token）
```jsx
{
    status: 401,
    message: "please login"
}
```

Testing curl
```jsx
curl -H "Accept: application/json" -H "Content-Type: application/json" -X GET https://yourapiserver/api/reports
```
