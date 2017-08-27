import Store from '../store'

import { tabDefaults, transitions } from '../defaults/tabs.js'

let id = 0

export const addTab = data => {
  const {
    select,
    url
  } = data

  const tab = {
    id: id,
    select: select,
    url: url,
    width: 0,
    pinned: false,
    left: 0,
    animateLeft: false,
    animateWidth: true,
    title: 'New tab',
    favicon: '',
    loading: false,
    render: true,
    renderPage: true,
    closing: false
  }

  Store.tabs.push(tab)
  id++
}

export const setWidths = (tabsWidth, addTabWidth, margin = 0) => {
  const width = getWidth(tabsWidth, addTabWidth, margin)
  
  const tabs = Store.tabs.filter(Boolean)
  const normalTabs = tabs.filter(tab => !tab.pinned)

  // Apply width for all normal tabs.
  normalTabs.forEach(tab => {
    if (tab.width === width) return
    tab.width = width
  })
}

export const getWidth = (tabsWidth, addTabWidth, margin = 0) => {
  const {
    pinnedTabWidth,
    maxTabWidth
  } = tabDefaults

  const tabs = Store.tabs.filter(tab => !tab.closing)
  const normalTabs = tabs.filter(tab => !tab.pinned)

  // Calculate margins between tabs.
  const margins = tabs.length * margin
  // Calculate all pinned tabs width.
  const allPinnedTabsWidth = (tabs.length - normalTabs.length) * pinnedTabWidth
  // Calculate final width per tab.
  let newNormalTabWidth = (tabsWidth - addTabWidth - margins - allPinnedTabsWidth) / (tabs.length - allPinnedTabsWidth)

  if (newNormalTabWidth < 32) newNormalTabWidth = 32

  // Limit width to `maxTabWidth`.
  if (newNormalTabWidth > maxTabWidth) newNormalTabWidth = maxTabWidth

  return newNormalTabWidth
}

export const getPosition = (index, margin = 0) => {
  let position = 0
  for (var i = 0; i < Store.tabs.length; i++) {
    position += Store.tabs[i].width + margin
  }
  return position
}

export const setPositions = (margin = 0) => {
  let addTabLeft = 0

  let tabs = Store.tabs.filter(tab => !tab.closing)

  // Apply lefts for all tabs.
  for (var i = 0; i < tabs.length; i++) {
    const tab = tabs[i]
    const newLeft = i * tab.width + i * margin
    tab.left = newLeft
    addTabLeft = newLeft + tab.width
  }

  // Apply left for add tab button.
  Store.addTabLeft = addTabLeft
}

export const getTabFromMouseX = (callingTab, xPos = null) => {
  for (var i = 0; i < Store.tabs.length; i++) {
    if (Store.tabs[i] !== callingTab) {
      if (containsX(Store.tabs[i], xPos)) {
        if (!Store.tabs[i].locked) {
          return Store.tabs[i]
        }
      }
    }
  }
  return null
}

export const containsX = (tabToCheck, xPos) => {
  const rect = {
    left: tabToCheck.left,
    right: tabToCheck.left + tabToCheck.width
  }

  if (xPos >= rect.left && xPos <= rect.right) return true

  return false
}

export const replaceTabs = (firstIndex, secondIndex, changePos = true) => {
  const tabs = Store.tabs.slice()

  const firstTab = tabs[firstIndex]
  const secondTab = tabs[secondIndex]

  tabs[firstIndex] = secondTab
  tabs[secondIndex] = firstTab

  Store.tabs = tabs

  console.log(Store.tabs)

  setPositions()

  /*
  // Change positions of replaced tabs.
  if (changePos) {
    secondTab.animateLeft = true
    secondTab.left = getPosition(secondTab.id, 0)
    secondTab.locked = true

    setTimeout(() => {
      secondTab.locked = false
    }, transitions.left.duration * 1000)
  }
  */
}

export const findTabToReplace = (callerTab, cursorX) => {
  const overTab = getTabFromMouseX(callerTab, cursorX)

  if (overTab != null && !overTab.pinned) {
    const indexTab = Store.tabs.indexOf(callerTab)
    const indexOverTab = Store.tabs.indexOf(overTab)

    replaceTabs(indexTab, indexOverTab)
  }
}