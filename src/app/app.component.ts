import { Component, OnInit, HostListener, Inject } from '@angular/core';

//import {LOCAL_STORAGE, WebStorageService, StorageServiceModule} from 'angular-webstorage-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  board_row: number = 8;
  board_col: number = 8;
  cellNum: number = 0;
  cellCordinates: Object = {};
  diamond_count: number = 8;
  diamondSet: Object = {};
  openedDiamondSet: Object = {};
  winCount: number = 0;
  modalShow: boolean = false;
  dummy:any;
  gameStatus = "Pending"
  rDiamond: Object = {};
  rBox: Object = {}
  alreadyOpenedArrow = [];
  alreadyOpenedDiamond:Object = {};
  totalDiamond:Object = {};  
  oldData:any;
  remainData = {}
  
  constructor() {
    this.remainData["totalDiamondPlace"] = {};
    this.remainData["remainDiamond"] = {};
    this.remainData["openedQuestion"] = {};
    this.remainData["openedDiamond"] = {};
}


  ngOnInit() {
    this.oldData = JSON.parse(localStorage.getItem("remainData"))
    console.log(this.oldData)
    console.log(this.oldData.openedQuestion)      
    if((Object.keys(this.oldData.openedDiamond).length < 8 && Object.keys(this.oldData.openedDiamond).length > 0) || this.oldData.openedQuestion.length > 0 ) {
        if(Object.keys(this.oldData.openedDiamond).length < 8) {
            $('#game').empty();
            this.initializeBoard();
            $('#progressAlert').modal('show');
        } else {
            alert("last game is already over, Starting new game!!!");
            this.initializeBoard();
            this.randomGenerators();
        } 
    } else {
        this.initializeBoard();
        this.randomGenerators();
    }
    
    }

    initializeBoard() {
    let table = document.createElement("table");
    table.id = "diamond_container";
    for (let i = 0; i < this.board_row; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < this.board_col; j++) {
            let td = document.createElement('td');
            let div = document.createElement('div');
            this.cellCordinates[this.cellNum] = {
                x: i,
                y: j
            };
            div.className = "cell unknown responsive";
            div.id = `${this.cellNum}`;
            this.cellNum++;
            td.appendChild(div)
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.getElementById("game").appendChild(table);
    document.getElementById("diamond_container").addEventListener("click", this.clickHandler);
}
randomGenerators() {
    while (Object.keys(this.diamondSet).length < this.diamond_count) {
        let randomnumber = Math.ceil(Math.random() * 63)
        this.diamondSet[randomnumber] = randomnumber;
    }
    console.log(this.diamondSet);
    this.totalDiamond = JSON.parse(JSON.stringify(this.diamondSet));
}

reStartGame() {
    localStorage.removeItem("remainData");    
    this.randomGenerators();
    this.winCount = 0;
    $('div').css('transform', 'none').removeClass('arrow diamond disabled').addClass('unknown');
 }

clickHandler = (e) => {        
        if (e.target.nodeName == 'DIV') {
            this.winCount++;
            if (this.diamondSet[e.target.id]) {
                e.target.className = "cell diamond disabled";
                console.log(this.diamondSet[e.target.id])
                delete this.diamondSet[e.target.id];
                this.openedDiamondSet[e.target.id] = e.target.id;
                console.log(this.dummy)
               if (Object.keys(this.diamondSet).length == 0) {
                    $('#winner').modal('show');                    
                    $('#winScore').empty().text(64 - this.winCount);
                }
            } else {
                if(Object.keys(this.diamondSet).length == 0) {
                    $('#AlertModel').modal('show');
                } else {
                    var slope = this.hint(e.target.id);
                    let opendQstn = {}
                    opendQstn["id"] = e.target.id;
                    opendQstn["slope"] = slope;
                    this.alreadyOpenedArrow.push(opendQstn);
                    $('td').removeClass('arrow');
                    e.target.className = "cell arrow disabled responsive";
                    e.target.style["boxShadow"] = 'none';
                    e.target.style["border"] = 'none';
                    e.target.style["transform"] = "rotate(" + slope + "deg)";
                }
                
            }
        }
}

continueLastGame() {
        this.diamondSet = this.oldData.remainDiamond;
        this.alreadyOpenedArrow = this.oldData.openedQuestion
        this.openedDiamondSet = this.oldData.openedDiamond;
        this.regenerateOldData()
}

regenerateOldData() {
    console.log(this.oldData.openedQuestion.length)
    this.oldData.openedQuestion.forEach((val) => {
        this.winCount++;
        let question = document.getElementById(val.id)
        question.className = 'cell arrow disabled responsive'
        question.style["transform"] = "rotate(" + val.slope + "deg)";
     })

    for(var id in this.oldData.openedDiamond) {
        this.winCount++;
        let diamond = document.getElementById(id)
        diamond.className = "cell diamond disabled"
    }
}

minDistance(clicked_id) {
    var distanceMap = {};
    Object.keys(this.diamondSet).map((id) => {
        distanceMap[id] = Math.abs(this.cellCordinates[clicked_id].x - this.cellCordinates[id].x) + 
                          Math.abs(this.cellCordinates[clicked_id].y - this.cellCordinates[id].y);
    });
    let nearestId = Object.keys(distanceMap).sort(function(a, b) {
        return distanceMap[a] - distanceMap[b]
    })
    return nearestId[0];
}

hint(clicked_id) {
    let nearestDiamondId = this.minDistance(clicked_id);
    return (Math.atan2((this.cellCordinates[nearestDiamondId].x - this.cellCordinates[clicked_id].x),
           (this.cellCordinates[nearestDiamondId].y - this.cellCordinates[clicked_id].y))) * 180 / Math.PI;
}

@HostListener('window:beforeunload') beforeunloadHandler() {
    
    this.remainData["totalDiamondPlace"] = this.totalDiamond
    this.remainData["remainDiamond"] = this.diamondSet;
    this.remainData["openedQuestion"] = this.alreadyOpenedArrow;
    this.remainData["openedDiamond"] = this.openedDiamondSet;
    localStorage.setItem("remainData", JSON.stringify(this.remainData));
   }

}
