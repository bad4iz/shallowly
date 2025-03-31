import React from 'react';
import { createElement } from 'react';



/**
 * Класс-обертка для поверхностного (shallow) рендеринга React-компонентов.
 * Позволяет рендерить компоненты без их дочерних компонентов и преобразовывать
 * результат в текстовое представление с отступами.
 */
export class ShallowWrapper {
  /**
   * Создает экземпляр ShallowWrapper для переданного компонента.
   *
   * @param {React.ReactNode} component - React-компонент или элемент для рендеринга.
   */
  constructor(component) {
    this.component = component;
    this.renderedElement = this.render();
  }

  /**
   * Рендерит компонент в его элементарное представление.
   *
   * @returns {React.ReactNode} Результат рендеринга компонента.
   */
  render() {
    if (React.isValidElement(this.component)) {
      const { type, props } = this.component;
      return typeof type === 'function'
        ? type(props)
        : createElement(type, props);
    }
    return this.component;
  }

  /**
   * Рендерит элемент в строку с отступами.
   *
   * @param {React.ReactNode} element - Элемент для рендеринга.
   * @param {number} [indent] - Уровень отступа.
   * @returns {string} Строковое представление элемента с отступами.
   */
  renderToString(element, indent = 0) {
    if (!React.isValidElement(element)) {
      // Если это просто текст, добавляем отступы
      return `${' '.repeat(indent)}${String(element)}`;
    }

    const type =
      typeof element.type === 'string'
        ? element.type
        : element.type.name || 'Unknown';

    const children =
      React.Children.map(element.props.children, (child) =>
        this.renderToString(child, indent + 2),
      ) || [];

    // Если у компонента нет детей и это самозакрывающийся тег
    if (children.length === 0 && type !== 'Unknown') {
      return `${' '.repeat(indent)}<${type} />`;
    }

    let result = `${' '.repeat(indent)}<${type}>`;

    if (children.length > 0) {
      result += '\n' + children.join('\n') + `\n${' '.repeat(indent)}`;
    }

    result += `</${type}>`;

    return result;
  }

  /**
   * Возвращает текстовое представление рендеренного компонента.
   *
   * @returns {string} Строковое представление компонента с отступами.
   */
  text() {
    return this.renderToString(this.renderedElement);
  }

  /**
   * Возвращает все props обернутого компонента или элемента.
   *
   * @returns {object} Объект с props.
   */
  props() {
    if (!React.isValidElement(this.renderedElement)) {
      return {};
    }

    // Для компонента возвращаем его props
    if (typeof this.component.type === 'function') {
      return this.component.props || {};
    }

    // Для DOM элемента возвращаем props рендеренного элемента
    return this.renderedElement.props || {};
  }

  /**
   * Возвращает значение конкретного prop.
   *
   * @param {string} key - Имя prop.
   * @returns {*} Значение prop.
   */
  prop(key) {
    return this.props()[key];
  }

  /**
   * Находит все подузлы в дереве компонентов, которые соответствуют переданному селектору.
   *
   * @param {string|React.ComponentType} selector - Селектор для поиска (имя компонента, CSS-селектор или компонент).
   * @returns {ShallowWrapper} Новая обертка с найденными элементами.
   */
  find(selector) {
    const results = [];
    this._findNodes(this.renderedElement, selector, results);
    return new ShallowWrapper(results.length === 1 ? results[0] : results);
  }

  /**
   * Рекурсивно ищет узлы, соответствующие селектору.
   *
   * @param {React.ReactNode} node - Узел для проверки.
   * @param {string|React.ComponentType} selector - Селектор.
   * @param {Array} results - Массив для сохранения результатов.
   * @private
   */
  _findNodes(node, selector, results) {
    if (!node) return;

    // Проверяем текущий узел
    if (this._matchesSelector(node, selector)) {
      results.push(node);
    }

    // Если узел - это React-элемент с детьми, рекурсивно проверяем детей
    if (React.isValidElement(node) && node.props.children) {
      React.Children.forEach(node.props.children, (child) => {
        this._findNodes(child, selector, results);
      });
    }
  }

  /**
   * Проверяет, соответствует ли узел заданному селектору.
   *
   * @param {React.ReactNode} node - Узел для проверки.
   * @param {string|React.ComponentType} selector - Селектор.
   * @returns {boolean} Соответствует ли узел селектору.
   * @private
   */
  _matchesSelector(node, selector) {
    if (!React.isValidElement(node)) return false;

    // Если селектор - это компонент (функция или класс)
    if (typeof selector === 'function') {
      return node.type === selector;
    }

    // Если селектор - строка (имя компонента или CSS-селектор)
    if (typeof selector === 'string') {
      // Проверяем по displayName или name компонента
      const componentName =
        typeof node.type === 'function'
          ? node.type.displayName || node.type.name
          : node.type;

      if (componentName === selector) return true;

      // Простая проверка CSS-селекторов (только для DOM элементов)
      if (typeof node.type === 'string') {
        // Проверяем по тегу
        if (node.type === selector) return true;

        // Проверяем по классу (селектор '.class')
        if (selector.startsWith('.') && node.props.className) {
          const classes = node.props.className.split(' ');
          return classes.includes(selector.slice(1));
        }

        // Проверяем по id (селектор '#id')
        if (selector.startsWith('#') && node.props.id === selector.slice(1)) {
          return true;
        }
      }
    }

    return false;
  }
  /**
   * Возвращает текстовое представление рендеренного компонента вместе с его пропсами.
   *
   * @returns {string} Строковое представление компонента с отступами и пропсами.
   */
  textWithProps() {
    return this._renderWithProps(this.renderedElement);
  }

  /**
   * Рекурсивно рендерит элемент в строку с отступами и пропсами.
   *
   * @param {React.ReactNode} element - Элемент для рендеринга.
   * @param {number} [indent] - Уровень отступа.
   * @returns {string} Строковое представление элемента с отступами и пропсами.
   */
  _renderWithProps(element, indent = 0) {
    if (!React.isValidElement(element)) {
      // Если это просто текст, добавляем отступы
      return `${' '.repeat(indent)}${String(element)}`;
    }

    const type =
      typeof element.type === 'string'
        ? element.type
        : element.type.name || 'Unknown';

    // Форматируем пропсы для вывода
    const formattedProps = [];
    for (const [key, value] of Object.entries(element.props)) {
      if (key === 'children') continue; // Пропускаем children

      // Специальная обработка функций
      const propValue =
        typeof value === 'function' ? 'function' : JSON.stringify(value);
      formattedProps.push(`${key}=${propValue}`);
    }

    const propsString =
      formattedProps.length > 0 ? ` ${formattedProps.join(' ')}` : '';

    const children =
      React.Children.map(element.props.children, (child) =>
        this._renderWithProps(child, indent + 2),
      ) || [];

    // Если у компонента нет детей и это самозакрывающийся тег
    if (children.length === 0 && type !== 'Unknown') {
      return `${' '.repeat(indent)}<${type}${propsString} />`;
    }

    let result = `${' '.repeat(indent)}<${type}${propsString}>`;

    if (children.length > 0) {
      result += '\n' + children.join('\n') + `\n${' '.repeat(indent)}`;
    }

    result += `</${type}>`;

    return result.replace(/\\"/g, '"');
  }
}

/**
 * Создает shallow-обертку для React-компонента.
 *
 * @param {React.ReactNode} component - React-компонент или элемент для рендеринга.
 * @returns {ShallowWrapper} Обертка для поверхностного рендеринга.
 */
