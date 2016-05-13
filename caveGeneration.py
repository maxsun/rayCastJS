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
        acceptableLine = checkLine(history,resolution)
        acceptableMap = checkMap(history,resolution)
        if acceptableLine is 1 and acceptableMap is 1:
            acceptable = 1
        if acceptable is 0:
            
            acceptable = 0

    Map = updateMap(Map,history)
    
    newMap = erectify(Map,resolution)
    
    hollowedMap = hollowfication(newMap,resolution,Map)

    borderedMap = []
    for row in hollowedMap:
        borderedMap.append([1] + row + [1])

    topBottomBorder = [1 for i in range(len(borderedMap[0]))]
    # return topBottomBorder + borderedMap + topBottomBorder
    borderedMap.append(topBottomBorder)
    borderedMap.insert(0, topBottomBorder)
    return borderedMap

def checkHistory(history,resolution):
    counterCap = len(history)
    counter = 0
    while counter < counterCap:
        if history[counter][0] >= resolution or history[counter][1] >= resolution or history[counter][0] < 0 or history[counter][1] < 0:
            del history[counter]
            counter = counter - 1
        counter = counter + 1
        counterCap = len(history)
    return history

def checkLine(history,resolution):
    if len(history) > resolution/2:
        quad1 = 0
        quad2 = 0
        quad3 = 0
        quad4 = 0
        counter = 0
        counterCap = len(history)
        while counter < counterCap:
            x = history[counter][0]
            y = history[counter][1]
            
            boundry = resolution/2
            if x > boundry and y > boundry:
                quad1 = 1
            if x < boundry and y > boundry:
                quad2 = 1
            if x > boundry and y < boundry:
                quad3 = 1
            if x < boundry and y < boundry:
                quad4 = 1
            if quad1 + quad2 + quad3 + quad4 > 3:
                return 1
            counter = counter + 1
        return 0
    return 0

def hollowfication(newMap,resolution,Map):
    hollowedMap = newMap
    counterCapX = resolution
    counterCapY = resolution
    counterX = 0
    while counterX < counterCapX:
        counterY = 0
        while counterY < counterCapY:
            if Map[counterX][counterY] > 0:
                
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
            if Map[counterX][counterY] > 0:
                
                newMap[counterX][counterY] = Map[counterX][counterY]
                if counterX-2 >= 0:
                    newMap[counterX-2][counterY] = Map[counterX][counterY]
                if counterX+2 < resolution:
                    newMap[counterX+2][counterY] = Map[counterX][counterY]
                if counterY-2 >= 0:
                    newMap[counterX][counterY-2] = Map[counterX][counterY]
                if counterY+2 < resolution:
                    newMap[counterX][counterY+2] = Map[counterX][counterY]

                if counterX-1 >= 0:
                    newMap[counterX-1][counterY] = Map[counterX][counterY]
                if counterX+1 < resolution:
                    newMap[counterX+1][counterY] = Map[counterX][counterY]
                if counterY-1 >= 0:
                    newMap[counterX][counterY-1] = Map[counterX][counterY]
                if counterY+1 < resolution:
                    newMap[counterX][counterY+1] = Map[counterX][counterY]
                    
                if counterX-1 > 0 and counterY-1 >= 0:
                    newMap[counterX-1][counterY-1] = Map[counterX][counterY]
                
                if counterX+1 < resolution and counterY-1 >= 0:
                    newMap[counterX+1][counterY-1] = Map[counterX][counterY]
                    
                if counterX-1 > 0 and counterY+1 < resolution:
                    newMap[counterX-1][counterY+1] = Map[counterX][counterY]

                if counterX+1 < resolution and counterY+1 < resolution:
                    newMap[counterX+1][counterY+1] = Map[counterX][counterY]

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
                displayString = displayString + "."
            else:
                displayString = displayString + str(Map[counter][xcounter])
            xcounter = xcounter + 1
        displayString = displayString + "\n"
        counter = counter + 1
    return displayString

def findCharacterPosition(x,y,resolution):
    chacterPosition = y*(resolution+1)+x
    return characterPosition

def updateMap(Map,history):
    counterCap = len(history)
    counter = 0
    while counter < counterCap:
        xPos = history[counter][0]
        yPos = history[counter][1]
        Map[xPos][yPos] = history[counter][2]
        counter = counter + 1
    return Map

def checkMap(history,resolution):
    number = len(history)
    squared = resolution * resolution
    coefficient = number/squared
    MAXcoefficient = 0.06
    MINcoefficient = 0.04
    if coefficient < MAXcoefficient and coefficient > MINcoefficient:
        return 1
    else:
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
    xyPos = [x,y,1]
    history.append(xyPos)
    firstTime = 0
    color = 1

    done = 0
    while done is 0:

        xyList = findXYFromAngle(angle,x,y)
        x1 = xyList[0]
        y1 = xyList[1]
        x = xyList[2]
        y = xyList[3]

        if firstTime is 1:
            firstTime = 0
        else:
            if x >= resolution-1 or x <= 0 or x1 >= resolution-1 or x1 <=0:
                done = 1
            if y >= resolution-1 or y <= 0 or y1 >= resolution-1 or y1 <= 0:
                done = 1

        if done is 1:
            history.pop
            history.pop
        else:
            xyPos = [x1,y1,color]
            history.append(xyPos)
            xyPos = [x,y,color]
            history.append(xyPos)

        randomNumber = random.randint(0,20)
        if randomNumber is 0:
            branchDirection = random.randint(0,1)
            if branchDirection is 0:
                branchAngle = angle - 90
            else:
                branchAngle = angle + 90
            if x is resolution or y is resolution or x is 0 or y is 0 or x1 is resolution or y1 is resolution or x1 is 0 or y1 is 0:
                cancelBranch = 1
            else:
                branch = makeBranch(resolution,x,y,branchAngle,10)
                history = appendLists(history,branch)

    return history

def makeBranch(resolution,x,y,angle,branchChance):
    branch = []
    color = random.randint(1,5)
    xyPos = [x,y,color]
    branch.append(xyPos)
    firstTime = 1

    done = 0
    while done is 0:

        xyList = findXYFromAngle(angle,x,y)
        x1 = xyList[0]
        y1 = xyList[1]
        x = xyList[2]
        y = xyList[3]

        if firstTime is 1:
            firstTime = 0
        else:
            if x >= resolution-1 or x <= 0 or x1 >= resolution-1 or x1 <=0:
                done = 1
            if y >= resolution-1 or y <= 0 or y1 >= resolution-1 or y1 <= 0:
                done = 1

        if done is 1:
            del branch[-1]
            del branch[-1]
        else:
            xyPos = [x1,y1,color]
            branch.append(xyPos)
            xyPos = [x,y,color]
            branch.append(xyPos)

        randomNumber = random.randint(0,branchChance)
        if randomNumber is 0:
            branchDirection = random.randint(0,1)
            if branchDirection is 0:
                branchAngle = angle - 90
            else:
                branchAngle = angle + 90
            if x is resolution or y is resolution or x is 0 or y is 0 or x1 is resolution or y1 is resolution or x1 is 0 or y1 is 0:
                cancelBranch = 1
            else:
                branchChance = branchChance + 5
                tempBranch = makeBranch(resolution,x,y,branchAngle,branchChance)
                branch = appendLists(branch,tempBranch)

    return branch

def findXYFromAngle(angle,x,y):
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

    returnList = []

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

    returnList.append(x1)
    returnList.append(y1)
    returnList.append(x)
    returnList.append(y)

    return returnList

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

"""
resolution = 64
hollowedMap = start(resolution)
print(hollowedMap)
displayString = display(hollowedMap,resolution)
print(displayString)
"""