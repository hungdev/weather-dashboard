export const fcConverter = (degree, type) => type === 'c' ? (degree - 32) / 1.8 : (degree * 1.8) + 32;