import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'spyrewall_cart'

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  // Sync to localStorage on every change
  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = useCallback((course) => {
    setItems(prev => {
      if (prev.some(item => item.id === course.id)) return prev // prevent duplicates
      return [...prev, { ...course, addedAt: Date.now() }]
    })
  }, [])

  const removeItem = useCallback((courseId) => {
    setItems(prev => prev.filter(item => item.id !== courseId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const isInCart = useCallback((courseId) => {
    return items.some(item => item.id === courseId)
  }, [items])

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0)
  const totalOriginalPrice = items.reduce((sum, item) => sum + (item.originalPrice || item.price), 0)
  const itemCount = items.length

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      clearCart,
      isInCart,
      totalPrice,
      totalOriginalPrice,
      itemCount,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within <CartProvider>')
  return ctx
}
