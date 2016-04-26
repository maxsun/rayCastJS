import random

def makeMap(resolution):
    counter = 0
    counterCap = resolution
    Map = []
    while counter < counterCap:
        x = []
        xcounter = 0
        xcounterCap = resolution
        while xcounter < xcounterCap:
            x.append(0)
            xcounter = xcounter + 1
        Map.append(x)
        counter = counter + 1
    return Map

def start(resolution):
    Map = makeMap(resolution)
    
    history = drawLine(resolution,Map,0,0,45)
    
    acceptable = 0
    while acceptable is 0:
        history = drawLine(resolution,Map,0,0,45)
        history = checkHistory(history,resolution)
        acceptable = checkLine(history,resolution)
        if checkMap(history,resolution) is 0:
            acceptable = 0
            #print("line is too long or too short")
        if acceptable is 0:
            #print("---retrying---")
            acceptable = 0

    Map = updateMap(Map,history)
    #displayString = display(Map,resolution)
    #print(displayString)
    newMap = erectify(Map,resolution)
    #displayString = display(newMap,resolution)
    #print(displayString)
    hollowedMap = hollowfication(newMap,resolution,Map)
    #displayString = display(hollowedMap,resolution)
    #print(displayString)
    return hollowedMap
    """ask = int(input("Make another? "))
    if ask is 1:
        print("Making another...")
        start()"""

def checkHistory(history,resolution):
    #try:
    counterCap = len(history)
    counter = 0
    while counter < counterCap:
        if history[counter][0] >= resolution or history[counter][1] >= resolution or history[counter][0] < 0 or history[counter][1] < 0:
            del history[counter]
            counter = counter - 1
        counter = counter + 1
        counterCap = len(history)
    return history
    """except:
        print("counter = " + str(counter))
        print("counterCap = " + str(counterCap))
        #print("history[counter][0] = " + str(history[counter][0]))
        #print("history[counter][1] = " + str(history[counter][1]))"""

def checkLine(history,resolution):
    #print("checking line...")
    if len(history) > resolution/2:
        quad1 = 0
        quad2 = 0
        quad3 = 0
        quad4 = 0
        counter = 0
        counterCap = len(history)
        while counter < counterCap:
            #print("checking quadrants")
            x = history[counter][0]
            y = history[counter][1]
            boundry = resolution/2
            if x >= boundry and y >= boundry:
                quad1 = 1
            if x <= boundry and y >= boundry:
                quad2 = 1
            if x >= boundry and y <= boundry:
                quad3 = 1
            if x <= boundry and y <= boundry:
                quad4 = 1
            if quad1 + quad2 + quad3 + quad4 > 3:
                #print("line is accepted")
                return 1
            counter = counter + 1
        return 0
    else:
        #print("line is rejected")
        return 0

def hollowfication(newMap,resolution,Map):
    hollowedMap = newMap
    counterCapX = resolution
    counterCapY = resolution
    counterX = 0
    while counterX < counterCapX:
        counterY = 0
        while counterY < counterCapY:
            if Map[counterX][counterY] is 1:
                
                hollowedMap[counterX][counterY] = 0

                if counterX-2 >= 0:
                    hollowedMap[counterX-1][counterY] = 0
                if counterX+2 < resolution:
                    hollowedMap[counterX+1][counterY] = 0
                if counterY-2 >= 0:
                    hollowedMap[counterX][counterY-1] = 0
                if counterY+2 < resolution:
                    hollowedMap[counterX][counterY+1] = 0

            counterY = counterY + 1
                    
        counterX = counterX + 1
    
    return hollowedMap

def erectify(Map,resolution):
    newMap = makeMap(resolution)
    counterCapX = resolution
    counterCapY = resolution
    counterX = 0
    while counterX < counterCapX:
        counterY = 0
        while counterY < counterCapY:
            if Map[counterX][counterY] is 1:
                
                newMap[counterX][counterY] = 1
                if counterX-2 >= 0:
                    newMap[counterX-2][counterY] = 1
                if counterX+2 < resolution:
                    newMap[counterX+2][counterY] = 1
                if counterY-2 >= 0:
                    newMap[counterX][counterY-2] = 1
                if counterY+2 < resolution:
                    newMap[counterX][counterY+2] = 1

                if counterX-1 >= 0:
                    newMap[counterX-1][counterY] = 1
                if counterX+1 < resolution:
                    newMap[counterX+1][counterY] = 1
                if counterY-1 >= 0:
                    newMap[counterX][counterY-1] = 1
                if counterY+1 < resolution:
                    newMap[counterX][counterY+1] = 1
                    
                if counterX-1 > 0 and counterY-1 >= 0:
                    newMap[counterX-1][counterY-1] = 1
                
                if counterX+1 < resolution and counterY-1 >= 0:
                    newMap[counterX+1][counterY-1] = 1
                    
                if counterX-1 > 0 and counterY+1 < resolution:
                    newMap[counterX-1][counterY+1] = 1

                if counterX+1 < resolution and counterY+1 < resolution:
                    newMap[counterX+1][counterY+1] = 1

            counterY = counterY + 1
                    
        counterX = counterX + 1
    return newMap

def display(Map,resolution):
    counter = 0
    counterCap = resolution
    displayString = ""
    while counter < counterCap:
        xcounterCap = resolution
        xcounter = 0
        while xcounter < xcounterCap:
            if Map[counter][xcounter] is 0:
                displayString = displayString + "□"
            if Map[counter][xcounter] is 1:
                displayString = displayString + "■"
            xcounter = xcounter + 1
        displayString = displayString + "\n"
        counter = counter + 1
    return displayString

def findCharacterPosition(x,y,resolution):
    chacterPosition = y*(resolution+1)+x
    return characterPosition

def updateMap(Map,history):
    counterCap = len(history)
    #print(counterCap)
    counter = 0
    while counter < counterCap:
        xPos = history[counter][0]
        yPos = history[counter][1]
        Map[xPos][yPos] = 1
        counter = counter + 1
    return Map

def checkMap(history,resolution):
    number = len(history)
    #print("number: " + str(number))
    squared = resolution * resolution
    #print("squared: " + str(squared))
    coefficient = number/squared
    MAXcoefficient = 0.06
    MINcoefficient = 0.04
    if coefficient < MAXcoefficient and coefficient > MINcoefficient:
        #print("coefficient: " + str(coefficient))
        return 1
    else:
        #print("Line failed with a coefficient of " + str(coefficient))
        return 0

def clearMap(resolution,Map):
    xcounterCap = resolution
    ycounterCap = resolution
    xcounter = 0
    ycounter = 0
    while xcounter < xcounterCap:
        while ycounter < ycounterCap:
            Map[xcounter][ycounter] = 0
            ycounter = ycounter + 1
        ycounter = 0
        xcounter = xcounter + 1

def drawLine(resolution,Map,x,y,angle):
    history = []
    xyPos = [x,y]
    history.append(xyPos)
    firstTime = 0

    done = 0
    while done is 0:

        randomNumber = random.randint(0,45)
        negative = random.randint(0,1)
        if negative is 0:
            angle = angle + randomNumber
        else:
            angle = angle - randomNumber
            
        if angle < 0:
            angle = angle + 360
        if angle > 360:
            angle = angle - 360

        x1 = 0
        y1 = 0

        if angle > 0 and angle <= 45:
            x1 = x + 1
            y1 = y + 1
            x = x + 2
            y = y + 1
        if angle > 45 and angle <= 90:
            x1 = x + 1
            y1 = y + 1
            x = x + 1
            y = y + 2
        if angle > 90 and angle <= 135:
            x1 = x - 1
            y1 = y + 1
            x = x - 1
            y = y + 2
        if angle > 135 and angle <= 180:
            x1 = x - 1
            y1 = y + 1
            x = x - 2
            y = y + 1
        if angle > 180 and angle <= 225:
            x1 = x - 1
            y1 = y - 1
            x = x - 2
            y = y - 1
        if angle > 225 and angle <= 270:
            x1 = x - 1
            y1 = y - 1
            x = x - 1
            y = y - 2
        if angle > 270 and angle <= 315:
            x1 = x + 1
            y1 = y - 1
            x = x + 1
            y = y - 2
        if angle > 315 and angle <= 360:
            x1 = x + 1
            y1 = y - 1
            x = x + 2
            y = y - 1

        if firstTime is 1:
            #print("firstTime")
            firstTime = 0
        else:
            if x >= resolution-1 or x <= 0 or x1 >= resolution-1 or x1 <=0:
                #print("x")
                done = 1
            if y >= resolution-1 or y <= 0 or y1 >= resolution-1 or y1 <= 0:
                #print("y")
                done = 1

        if done is 1:
            history.pop
            history.pop
            #print("done")
        else:
            xyPos = [x1,y1]
            history.append(xyPos)
            xyPos = [x,y]
            history.append(xyPos)

        randomNumber = random.randint(0,20)
        if randomNumber is 0:
            branchDirection = random.randint(0,1)
            if branchDirection is 0:
                branchAngle = angle - 90
            else:
                branchAngle = angle + 90
            if x is resolution or y is resolution or x is 0 or y is 0 or x1 is resolution or y1 is resolution or x1 is 0 or y1 is 0:
                #print("cancel branch")
                cancelBranch = 1
            else:
                branch = makeBranch(resolution,x,y,branchAngle,25)
                history = appendLists(history,branch)

    #print("printing history... ")
    #print(history)

    return history

def makeBranch(resolution,x,y,angle,branchChance):
    #print("starting branch at x: " + str(x) + ", y: " + str(y))
    branch = []
    xyPos = [x,y]
    branch.append(xyPos)
    firstTime = 1

    done = 0
    while done is 0:

        randomNumber = random.randint(0,45)
        negative = random.randint(0,1)
        if negative is 0:
            angle = angle + randomNumber
        else:
            angle = angle - randomNumber
            
        if angle < 0:
            angle = angle + 360
        if angle > 360:
            angle = angle - 360

        x1 = 0
        y1 = 0

        if angle > 0 and angle <= 45:
            x1 = x + 1
            y1 = y + 1
            x = x + 2
            y = y + 1
        if angle > 45 and angle <= 90:
            x1 = x + 1
            y1 = y + 1
            x = x + 1
            y = y + 2
        if angle > 90 and angle <= 135:
            x1 = x - 1
            y1 = y + 1
            x = x - 1
            y = y + 2
        if angle > 135 and angle <= 180:
            x1 = x - 1
            y1 = y + 1
            x = x - 2
            y = y + 1
        if angle > 180 and angle <= 225:
            x1 = x - 1
            y1 = y - 1
            x = x - 2
            y = y - 1
        if angle > 225 and angle <= 270:
            x1 = x - 1
            y1 = y - 1
            x = x - 1
            y = y - 2
        if angle > 270 and angle <= 315:
            x1 = x + 1
            y1 = y - 1
            x = x + 1
            y = y - 2
        if angle > 315 and angle <= 360:
            x1 = x + 1
            y1 = y - 1
            x = x + 2
            y = y - 1

        if firstTime is 1:
            #print("firstTime")
            firstTime = 0
        else:
            if x >= resolution-1 or x <= 0 or x1 >= resolution-1 or x1 <=0:
                #print("x")
                done = 1
            if y >= resolution-1 or y <= 0 or y1 >= resolution-1 or y1 <= 0:
                #print("y")
                done = 1

        if done is 1:
            del branch[-1]
            del branch[-1]
            #print("done")
        else:
            xyPos = [x1,y1]
            branch.append(xyPos)
            xyPos = [x,y]
            branch.append(xyPos)

        randomNumber = random.randint(0,branchChance)
        if randomNumber is 0:
            branchDirection = random.randint(0,1)
            if branchDirection is 0:
                branchAngle = angle - 90
            else:
                branchAngle = angle + 90
            if x is resolution or y is resolution or x is 0 or y is 0 or x1 is resolution or y1 is resolution or x1 is 0 or y1 is 0:
                #print("cancel branch")
                cancelBranch = 1
            else:
                branchChance = branchChance + 5
                tempBranch = makeBranch(resolution,x,y,branchAngle,branchChance)
                branch = appendLists(branch,tempBranch)

    #print("printing branch... ")
    #print(branch)

    return branch

def appendLists(listToAppend,appendList):
    counter = 0
    counterCap = len(appendList)
    while counter < counterCap:
        listToAppend.append(appendList[counter])
        counter = counter + 1
    return listToAppend

def getResolution():
    resolution = int(input("resolution: "))
    return resolution

#start(resolution)
