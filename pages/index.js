
import React, { useState, useEffect } from 'react';
 import {astar, Graph} from './api/astar'

 import Script from 'next/script'
export default function Home() {
  const [boundingX, setBoundingX] = useState(50);
  const [boundingY, setBoundingY] = useState(50);
  const [hoverxy, setHoverxy] = useState([0,0]);

  const [initialpos, setInitialpos] = useState([5,46]
    );
  const [destinationpos, setDestinationpos] = useState([43,9]
    );

  const [clickdebounce, setclickdebounce] = useState(true);

  const [obselect1, setObSelect1] = useState([null,null]);


  const [obsarray, setObsArray] = useState([[5,33,18,39],[16,26,48,29],[1,19,37,20],[21,12,50,13]
  ]);
  const [hoverobslist, setHoverobslist] = useState(null);


  const [mousemode, setMouseMode] = useState('initial');

  const [problemJson, setProblemJson] = useState({});

  const [problemJsontxt, setProblemJsontxt] = useState("");




  const [refreshGrid, setRefreshGrid] = useState(true);

  const [steps, setSteps] = useState([[43, 9], [43, 10], [42, 10], [42, 11], [41, 11], [40, 11], [39, 11], [38, 11], [37, 11], [36, 11], [35, 11], [34, 11], [33, 11], [32, 11], [31, 11], [30, 11], [29, 11], [28, 11], [27, 11], [26, 11], [25, 11], [24, 11], [23, 11], [22, 11], [21, 11], [20, 11], [20, 12], [20, 13], [20, 14], [21, 14], [22, 14], [23, 14], [24, 14], [25, 14], [26, 14], [27, 14], [28, 14], [29, 14], [30, 14], [31, 14], [32, 14], [33, 14], [34, 14], [35, 14], [36, 14], [37, 14], [38, 14], [38, 15], [38, 16], [38, 17], [38, 18], [38, 19], [38, 20], [38, 21], [37, 21], [36, 21], [35, 21], [34, 21], [33, 21], [32, 21], [31, 21], [31, 22], [30, 22], [30, 23], [29, 23], [29, 24], [28, 24], [28, 25], [27, 25], [26, 25], [25, 25], [24, 25], [23, 25], [22, 25], [21, 25], [20, 25], [19, 25], [18, 25], [17, 25],[16, 25], [15, 25], [15, 26], [15, 27], [15, 28], [15, 29],[15, 30], [15, 31], [15, 32], [14, 32], [13, 32], [12, 32], [11, 32], [10, 32], [9, 32], [8, 32], [7, 32], [6, 32], [5, 32] ]
    );

  const [stepstxt, setStepstxt] = useState("")

  const [solution, setSolution] = useState([])

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    refreshJson()
    setStepstxt(JSON.stringify(steps).replace(/,"/g, `,\n"`).replace(`{`, `{\n`) )
  },[]);

  useEffect(() => {
    refreshJson()
  
  },[boundingX,boundingY,initialpos,destinationpos,obsarray]);

  const refreshJson = () =>{
    var newJson ={
      bounding_box:[0,0,boundingX,boundingY],
      initial_position:initialpos,
      destination:destinationpos,
      obstacles:obsarray

     
    }
    console.log(newJson)
    setProblemJsontxt( JSON.stringify(newJson).replace(/,"/g, `,\n"`).replace(`{`, `{\n`))
   
    setProblemJson(newJson)
  }


  
  


  useEffect(() => {
    setRefreshGrid(true)
  },[refreshGrid]);

  

  useEffect(() => {
    console.log(mousemode)

  },[mousemode]);

  

    

  useEffect(() => {
    solve()

  },[obsarray.length]);

  const onClickCell = (x,y) =>{

      switch(mousemode) {
        case 'initial':
          setInitialpos([x,y])
          setclickdebounce(true)
          break;
        case 'destination':
          setDestinationpos([x,y])
          setclickdebounce(true)
          break;
        case 'obstacle1':
          setObSelect1([x,y])
          setMouseMode('obstacle2')
          break;
        case 'obstacle2':
          var x1 = Math.min(obselect1[0] , x)
          var y1 = Math.min(obselect1[1] , y)

          var x2 = Math.max(obselect1[0] , x)
          var y2 = Math.max(obselect1[1] , y)

          var newobs = [x1,y1,x2,y2]
 
          var oldobs = [...obsarray]
          var newarrayobs  = oldobs.concat([newobs])
      
          setObsArray(newarrayobs)
          setObSelect1([null,null])
          setMouseMode('obstacle1')
          break;
        default:
          // code block
      }

    
    

  }

  
  const cellcolor = (x,y) =>{
    var thiscss =""
    if(initialpos[0] == x && initialpos[1] ==y){
      thiscss = thiscss + ' bluebg'
    }
    if(destinationpos[0] == x && destinationpos[1] ==y){
      thiscss = thiscss + ' greenbg'
    }
    if(obselect1[0] == x && obselect1[1] ==y){
      thiscss = thiscss + ' orangebg'
    }


    
    if(hoverxy[0] == x && hoverxy[1] ==y){
      if(mousemode =='initial'){
       thiscss = thiscss + ' cellblue'
      }
      if(mousemode =='destination'){
        thiscss = thiscss + ' cellgreen'
      }

      if(mousemode =='obstacle1' || mousemode =='obstacle2'){
      thiscss = thiscss + ' cellred'
      }

       
    }

    var isobstacle =false
    var isobstaclehover =false
    var ispath =false

    var issolution =false


    obsarray.map((obs,index) =>{
      
      var x1 = obs[0]
      var y1 = obs[1]

      var x2 = obs[2]
      var y2 = obs[3]

      
      if((x1 <= x && x2 >= x ) && (y1 <= y && y2 >= y )){
        isobstacle =true

        if(index == hoverobslist){
          isobstaclehover=true
        }
      }

      
    })

    try{
      steps.map((step,index) =>{      
        var x1 = step[0]
        var y1 = step[1]  
        if((x1 == x ) && (y1 == y  )){
          ispath =true
        }
      })
    } 
    catch{}

    try{
      solution.map((step,index) =>{      
        var x1 = step[0]
        var y1 = step[1]  
        if((x1 == x ) && (y1 == y  )){
          issolution =true
        }
      })
    } 
    catch{}
    
    if(isobstacle){
      thiscss = thiscss + ' redbg'
     }
     if(isobstaclehover){
      thiscss = thiscss + ' redbglisthover'
     }

     if(mousemode == 'obstacle2'){
      var sx1 = obselect1[0]
      var sy1 = obselect1[1]
 
      var sx2 = hoverxy[0]
      var sy2 = hoverxy[1]
 
 
      if(
           ((sx1 <= x && sx2 >= x ) || (sx1 >= x && sx2 <= x ))
       &&  ((sy1 <= y && sy2 >= y ) || (sy1 >= y && sy2 <= y ))
       
       ){
         thiscss = thiscss + ' redbglisthover'
 
      
       }
     }

     if(issolution){
      thiscss = thiscss + ' pinkbg'
     }

     if(ispath){
      thiscss = thiscss + ' yellowbg'
     }
    return(thiscss)
  }

  const renderCell = (x,y) =>{
    return(
      <div key={`${x},${y}`}  onMouseEnter={()=>{setHoverxy([x,y])}}
      
        onClick={()=>{onClickCell(x,y)}}

        className={`cell
          ${cellcolor(x,y)}
   
        
        `}
      
      >
         {/* {`${x},${y}`} */}
      </div>
    )
  }


  const renderGrid = () =>{
    
    var rows =[]
    for (let y = boundingY; y >-1 ; y--) {
    
      var columns =[]
      for (let x = 0; x <= boundingX; x++) {

        if(y==0 ){
          columns.push(
            <div key={`${x}`} className={`cellnum ${ hoverxy[0] == x ? 'activecellnum':null}`}>
              {x}
            </div>
          )
        }else if(x==0 ){
          columns.push(
            <div key={`${y}`} className={`cellnum ${ hoverxy[1] == y ? 'activecellnum':null}`}>
              {y}
            </div>
          )
        }else{
          columns.push(renderCell(x,y));
        }
        
      }

      if(y==0){
        rows.push(
        <div className='horizontal'>
           {columns}
        </div>
         )
      }else{
        rows.push(
          <div className='horizontal'>
            {columns}
          </div>
        )
      }
    
    } 
    return(
      <div>
          {rows}
      </div>
      
    )
  }

  const reset = () =>{
    setRefreshGrid(false)
    setBoundingX(50)
    setBoundingY(50)
    setInitialpos([10,25])
    setDestinationpos([40,25])
    setObsArray([[23,20,33,40]])
    setSteps([])
    setSolution([])

  }


  const removeObstacle = (index) => {
    var arr = obsarray 

    arr.splice(index,1)
    console.log(arr)
    setObsArray(arr)
  }
  
  function downloadObjectAsJson(){
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(problemJson)], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = 'navigation.json';
    a.click();
  }


  const solve = () =>{

    try{

    
    var rows =[]
    for (let y = 1 ; y <= boundingY ; y++) {
    
      var columns =[]
      for (let x = 1; x <= boundingX ; x++) {
      
        var isobstacle = false
        obsarray.map((obs,index) =>{      
          var y1 = obs[0]
          var x1 = obs[1]
  
          var y2 = obs[2]
          var x2 = obs[3]
          if((x1 <= x && x2 >= x ) && (y1 <= y && y2 >= y )){
            isobstacle =true    
          }
        })

        if(isobstacle){
          columns.push(parseInt(0))
        }else{
          columns.push(parseInt(1))

        }

        
      }
      rows.push(columns)

    
    } 
   
  console.log(rows)
    var graph = new Graph(rows);
    var start = graph.grid[initialpos[0]][initialpos[1]];
    var end = graph.grid[destinationpos[0]][destinationpos[1]];
    var result = astar.search(graph, start, end);


    // result is an array containing the shortest path
    // var graphDiagonal = new Graph([
    //   [1,1,1,1],
    //   [0,1,1,0],
    //   [0,0,1,1]
    // ], { diagonal: true });
    
    // var start = graphDiagonal.grid[0][0];
    // var end = graphDiagonal.grid[1][2];
      // var resultWithDiagonals = astar.search(graphDiagonal, start, end, { heuristic: astar.heuristics.diagonal });
      // Weight can easily be added by increasing the values within the graph, and where 0 is infinite (a wall)
      var graphWithWeight = new Graph(rows);
      // var startWithWeight = graphWithWeight.grid[0][0];
      // var endWithWeight = graphWithWeight.grid[1][2];

      var startWithWeight = graphWithWeight.grid[initialpos[0]-1][initialpos[1]-1];
      var endWithWeight =  graphWithWeight.grid[destinationpos[0]-1][destinationpos[1]-1];
      var resultWithWeight = astar.search(graphWithWeight, startWithWeight, endWithWeight);
      var sol = resultWithWeight.map(r=>{
        return([r.x+1,r.y+1])
        console.log(r)
      })
      setSolution(sol)
      
      if(steps.length == 0 ){
        setSteps([])
        setStepstxt(JSON.stringify(sol).replace(/,"/g, `,\n"`).replace(`{`, `{\n`) )
      }
    }catch{}
  } 

  return (
    <div className={"container"}>

        <div className='commandbar'>
           
            <div className='vertical'>
            <button className='mb1'  onClick={()=>{solve()}}> solve</button>
            <span> X axis: {boundingX}</span>
            <input    id="typeinp"       type="range"       min="1" max="50"  value={boundingX}  onChange={(e)=>{setBoundingX(parseInt(e.target.value))}} />
            <span> Y axis: {boundingY}</span>
            <input    id="typeinp"    className='mb1'   type="range"       min="1" max="50"  value={boundingY}  onChange={(e)=>{setBoundingY(parseInt(e.target.value))}} />
        
            <button className='mb1' onClick={()=>{setRefreshGrid(false)}}> refresh grid</button>

            <span> start postion: {`${initialpos[0]},${initialpos[1]}`}</span>
            <button className='mb1' style={{background:'blue'}} onClick={()=>{setMouseMode('initial')}}> set Initial Postion</button>

            <span> end postion: {`${destinationpos[0]},${destinationpos[1]}`}</span>
            <button className='mb1' style={{background:'green'}} onClick={()=>{setMouseMode('destination')}}> set destination Postion</button>

            <span> obstacles:</span>
            
            <button className='mb1' style={{background:'red'}} onClick={()=>{setMouseMode('obstacle1')}}> create obstacle</button>

            {  obsarray.map((obs,index) =>{
                  var x1 = obs[0]
                  var y1 = obs[1]
            
                  var x2 = obs[2]
                  var y2 = obs[3]

                  return(
                    <div key={index} className='obslist' onMouseEnter={()=>{setHoverobslist(index)}} onMouseLeave={()=>{setHoverobslist(null)}}> 
                      <div>  {`${x1},${y1}  ||  ${x2},${y2}`} </div>
                    
                      <button onClick={()=>{removeObstacle(index)}}>X</button>
                    </div>
                  )
                  
               })  
            }
            </div>
            <button className='mb1' onClick={()=>{reset()}}> reset grid</button>

        </div>

        <div className={"cell_container"}>
            {refreshGrid ? renderGrid() :null}       
        </div>

        <div className='jsonbar'>
           <span> JSON: </span>
           <textarea className='txtarea mb1'
            defaultValue={JSON.stringify(problemJson).replace(/,"/g, `,\n"`).replace(`{`, `{\n`)}
            value={problemJsontxt}
            onChange={(e)=>{
                setProblemJsontxt(e.target.value)
              try{
                var data =e.target.value
                console.log(data)
                var arr = JSON.parse(data)
                console.log(arr)
                if(arr?.bounding_box){
                  setBoundingX(arr.bounding_box[2])
                  setBoundingY(arr.bounding_box[3])
                }

                if(arr?.initial_position){
                  setInitialpos(arr.initial_position)
                  console.log(arr.initial_position)
         
                }
                if(arr?.destination){
                  setDestinationpos(arr.destination)
         
                }
        
                if(arr?.obstacles){
                  setObsArray(arr.obstacles)
         
                }
        
              
              }catch{

              }
    
              }}
           >

           </textarea>
           <button className='mb1' onClick={()=>{downloadObjectAsJson()}}> download json</button>

           <span> Steps: {steps.length}</span>
           <textarea className=' txtarea2 mb1'
            defaultvalue={JSON.stringify(steps)}
            value={stepstxt}
            onChange={(e)=>{
              setStepstxt(e.target.value)
              if(e.target.value ==""){
                setSteps([])
              }
              try{
                var data = `{"steps": ${e.target.value} }` 
                console.log(data)
                var arr = JSON.parse(data)
                console.log(arr)
                if(arr?.steps){
                  setSteps(arr.steps)
                }
              }catch{

              }
    
              }}
           >

           </textarea>


           <span> Solution Steps: {solution.length}</span>
        </div>


            

    </div>
  )
}
