import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Swal from 'sweetalert2'
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';


//komponent yang akan memunculkan alert yang cantik
function AlertFun(){
    useEffect(() => {
        setTimeout(() => {
            Swal.fire('Good job!','You are finished the quiz','success')
        }, 500);
    }, []);

    return(
        <>
        </>
    )
}



class Quiz extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            soal:[],
            jawaban: ['null', 'null','null', 'null', 'null'],
            nowQues: 0,
            finish: false,
            seconds: 0,
            start: false,
            helper  : 0,

        }
        this.answernote = [...this.state.soal]
        this.benar = 0
        this.kosong = 0
        this.salah = 0
        this.resume = false
        this.send = true

        if(this.state.finish){Swal.fire('Good job!','You clicked the button!','success')}

    
    }

    //mengambil data 
    async getData(){
        this.source = axios.CancelToken.source();
        const data = await axios.get('https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=boolean&encode=base64', { cancelToken: this.source.token });
        return data
    }

    componentDidMount(){
        this.getData().then((result)=>{
            this.setState({
                soal:result.data.results
            })
           }).catch((err)=>{
            if (!axios.isCancel(err)) {
                this.setState({ error: err.message });
              }
           })
        this.answernote = [...this.state.soal]
    }

    //digunakan untuk memulai quiz
    startQuiz(){
        this.setState({start:true})
        this.startTimer()
        setInterval(() => {
            if(!this.state.finish){
                if(this.state.seconds <= 4){
                    this.setState({
                        seconds: this.state.seconds + 1
                    })}else{
                        this.setState({
                            seconds: 0
                        })
                    }
                }
        }, 1000)
    }

    startTimer(){
            setInterval(()=>{
                if(this.state.nowQues === 4){
                    this.setState({
                        finish: true,
                        nowQues: 0
                    })
                }else{
                    this.setState({
                        nowQues: this.state.nowQues + 1,
                    })
                }
            },6000)
    }



    //digunakan  untuk mengirim data quiz yang telah kita inputkan ke localstorage
    setResume(benar,salah,kosong, condition){
        let dataInsert =  
            {
                benar: benar,
                salah: salah,
                kosong: kosong,
                skor: benar/5*100,
                date:  new Date().getDate(),
                month:  new Date().getMonth(),
                year: new Date().getFullYear(),
                hour: new Date().getHours(),
                minute: new Date().getMinutes(),
                second: new Date().getSeconds(),
            }
        
            if(condition){
                if(localStorage.getItem('data') == null){
                    localStorage.setItem('data', '[]')
                }
                
                
                    let getData  =  JSON.parse(localStorage.getItem('data'))
                    getData.push(dataInsert)
                    localStorage.setItem('data', JSON.stringify(getData));
            }
            
    }

    //digunakan untuk mengganti/mengupdate state jawaban yang kita miliki dengan jawaban yang sudah kita inputkan
    setAnswer(n){
        if(this.state.start){
        let answer = [...this.state.jawaban]
        answer[this.state.nowQues] = n.target.textContent
            this.setState({
                jawaban:answer
            })
        }

    }

    render() {
        return (
            <Container className='my-5'>
                <Row>
                <Col xs={7}>

                <Row className='mb-5'>
                    <Col xs={10}>
                <Card body className=''>
                
                    {this.state.nowQues !== 5 && !this.state.finish && <h3>Statement : </h3>}
                    {this.state.nowQues !== 5 && this.state.start && !this.state.finish ?
                    this.state.soal.map((response,index)=>{
                        if(index === this.state.nowQues && !this.state.finish){
                            return <h6 key={index}>{window.atob(response.question)}</h6>
                        }else{
                            return null;
                        }
                    }) :  (this.state.start && <h2 className='p-3 '>Finished</h2>)
                    }
                </Card>
                </Col>
                <Col xs={2}>
                    <Card body>
                    <h4 className='text-center'>Timer</h4>
                    {!this.state.finish ? <h1 className='text-center'>{this.state.seconds}</h1> : <h5 className='bg-danger p-2 text-white text-center rounded-circle'>Time Up</h5> }
                    </Card>
                </Col>
                </Row>
                <Card body>
                {this.state.helper!== 100 ? <h1 className='text-center'>Option</h1> : <h1 className='text-center'>Hoorayy &#10024;</h1>}
                    <Container>
                        {this.state.helper!== 100 ? 
                        <Row className='mt-5'>
                            <Card body className='my-3 answer' onClick={this.setAnswer.bind(this)}>True</Card>
                            <Card body className='my-3 answer' onClick={this.setAnswer.bind(this)}>False</Card>
                        </Row>
                        : <span><h1>You have finished the quiz &#9997;</h1><br/><Card body>
                            
                            <h5>Skor</h5>
                            <h1>{this.benar/2/5*100}/100</h1>
                            </Card></span>}
                        <br/>
                        
                        {this.state.helper === 100 && <button className="btn btn-danger text-white" onClick={()=>{
                            this.setResume(this.benar/2, this.salah/2, this.kosong/2, this.send)
                            this.resume = !this.resume
                            this.send = false
                        }
                        }>
                                Resume</button>}
                    </Container>
                </Card>
                {!this.state.start ? <button className='btn btn-primary mt-4 px-4'  onClick={this.startQuiz.bind(this)} >Start</button> : this.state.helper === 100 ? <p> </p> : <Card body className='mt-5'><h3>Statement number : {this.state.nowQues + 1}</h3></Card>
   
                }
                {
                    this.resume &&
                    <Container className="my-5 p-5 mx-auto">
                            <h1 className='text-center my-3'>Resume Quiz</h1>
                            <ListGroup as="ol" numbered>

                            {localStorage.getItem('data') && 
                            JSON.parse(localStorage.getItem('data')).map((context,key)=>{

                                return <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start my-3"
                              >
                                <div className="ms-2 me-auto">
                                  <div className="fw-bold">Date : {context.date}/{context.month}/{context.year} Time : {context.hour}h{context.minute}m{context.second}s</div>
                                  Benar : {context.benar} | Salah : {context.salah} | Kosong : {context.kosong} 
                                </div>
                                <Badge bg="primary" pill>
                                  {context.skor}
                                </Badge>
                              </ListGroup.Item>
                            })}
                            </ListGroup>
                        </Container>

                        
                }
                </Col>
                <Col xs={5}>
                    <Card body>
                        <h1 className='text-center'>Your Answer</h1>
                        {this.state.jawaban.map((context,index)=>{
                            if(context === 'null'){
                                return( <Alert variant={'warning'} className='mt-3' key={index}>
                                you have not Finished the question</Alert>
                                )
                            }else{
                                return( <Alert variant={'success'} className='mt-3' key={index}>
                                your answer : {context} <br/>
                                Statement : {window.atob([...this.state.soal][index].question)}
                                </Alert>
                                )
                            }
                        })}
                    </Card>

                    <Card body className='mt-5'>
                        <h1 className='text-center my-4'>Result</h1>
                            {
                            this.state.finish && this.state.soal.map((response,index)=>{
                                if(this.state.helper < 5){
                                    this.setState({
                                        helper: index
                                    })
                                }else{
                                    this.setState({
                                        helper: 100
                                    })
                                }
                                if(window.atob(response.correct_answer) === [...this.state.jawaban][index]){
                                    if(this.state.helper !== 100){
                                        console.log("benar")
                                        this.benar++;
                                    }
                                    return( <Alert variant={'success'} className='my-3' key={index}>
                                your answer is Correct{index === 4 && this.setState({helper:100})} 
                                <br />
                                <br/>
                                Statement : {window.atob(response.question)}
                                <br/>
                                your answer : {[...this.state.jawaban][index]}
                                </Alert>
                                )
                            }else{
                                return( 
                                [...this.state.jawaban][index] !== 'null' ?  <Alert variant={'danger'} className='my-3' key={index}>your answer not correct <br /><br/>
                                Statement : {window.atob(response.question)}
                                <br/>
                                your answer : {[...this.state.jawaban][index]}
                                {this.state.helper !== 100 && this.salah++} {index === 4 && this.setState({helper:100})}</Alert> : <Alert variant={'warning'} className='my-3' key={index}>
                                    you were not aswering 
                                    <br/>
                                    <br />
                                    Statement : {window.atob(response.question)}

                                    {this.state.helper !== 100 && this.kosong++} {index === 4 && this.setState({helper:100})}</Alert>
                                )
                            }         
                    }
                    )
                    }
                        {this.state.finish && <AlertFun/>}
                        {this.state.finish && <h6>Benar : {this.benar/2} Salah : {this.salah/2} kosong : {this.kosong/2}</h6>}
                    </Card>
                </Col>
            </Row>
            </Container>
        );
    }
}

export default Quiz;