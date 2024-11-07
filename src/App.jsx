import Hear from "./hear"
function App() {
  const user = {
    avatar: "https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/435177350_1363353011723347_8334404241651107774_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=OX2u_s09NXIQ7kNvgGuGnAn&_nc_zt=23&_nc_ht=scontent.fsgn5-9.fna&_nc_gid=A7BPkjjlAFlRj3oUAEeMTnr&oh=00_AYCTew-ST5a7REZ-YX-_GobXalcq5VoQ2QtukqOyynu6Ig&oe=67328962",
    dateBirth: "2004-01-29T17:00:00.000Z",
    fullName: "Trần Văn Thành",
    gender: "Nam",
    loveDay: "2024-01-12T00:00:00.000Z",
    pending_request_id: "670f35a18c3813da17414b01",
    pending_request_to: {
      _id: "670f35a18c3813da17414b01",
      fullName: "Thân Thị Kim Duyên", 
      phoneNumber: "0393900748",
      gender: "Nữ",
      dateBirth: "2003-04-19T17:00:00.000Z",
      loveDay: "2024-01-12T00:00:00.000Z",
      avatar: "/src/assets/Dyn.jpeg"
    },
    phoneNumber: "0363900902",
    status: "pending",
    _id: "670f35f630665dd1ec2ea8d9"
  }
  return (
    <>
      <Hear user={user}/>
    </>
  )
}

export default App
